/**
 * OnePlace Enterprise — WhatsApp Service (WPPConnect)
 *
 * Express microservice that embeds WPPConnect directly into OnePlace.
 * One WhatsApp session per authenticated OnePlace user, persisted on disk via
 * WPPConnect's file token store, so sessions survive restarts.
 *
 * Auth model (unchanged from the original service):
 *   1. Caller presents a Firebase ID token (Authorization: Bearer ...).
 *   2. All endpoints are authorized directly from the authenticated Firebase user.
 *
 * Local development: set ALLOW_LOCAL_DEV=true to bypass Firebase with an
 * X-User-Id header instead.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { jwtVerify, createRemoteJWKSet } = require('jose');

let wppconnect;

function getWppconnect() {
  if (!wppconnect) {
    wppconnect = require('@wppconnect-team/wppconnect');
  }
  return wppconnect;
}

const app = express();
const PORT = Number(process.env.PORT || 3001);
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const FRONTEND_DIR = path.resolve(__dirname, '..');
const ALLOW_LOCAL_DEV = process.env.ALLOW_LOCAL_DEV === 'true';
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'oneplace-c3ac8';
const FIREBASE_ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
const FIREBASE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
// In-memory caps (per authenticated user)
const MAX_MESSAGES_PER_CHAT = Number(process.env.WHATSAPP_MAX_MESSAGES_PER_CHAT || 500);
const MAX_EVENTS_PER_WORKSPACE = Number(process.env.WHATSAPP_MAX_EVENTS || 1000);

fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const sessions = new Map();

// ============================================
// Session registry helpers
// ============================================

function normalizeSessionUid(raw) {
  const value = String(raw || '').trim();
  return value || 'default';
}

function getSessionName(uid) {
  const normalized = normalizeSessionUid(uid).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `oneplace_user_${normalized || 'default'}`;
}

function getSessionMeta(uid) {
  const sessionName = getSessionName(uid);
  if (!sessions.has(sessionName)) {
    sessions.set(sessionName, {
      uid,
      sessionName,
      client: null,
      creating: null,          // Promise while wppconnect.create() is in flight
      status: 'notLogged',
      qr: null,
      pairingCode: null,
      connectedAt: null,
      updatedAt: null,
      lastError: null,
      messageStore: new Map(), // chatId -> normalized message[]
      events: [],              // { seq, type, message, timestamp }
      eventSeq: 0
    });
  }
  return sessions.get(sessionName);
}

function hasStoredToken(uid) {
  const dir = path.join(SESSIONS_DIR, getSessionName(uid));
  try {
    return fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
  } catch (error) {
    return false;
  }
}

// ============================================
// Status mapping
// ============================================

function mapStatus(status) {
  const normalized = String(status || 'notLogged').trim();
  const value = normalized.toLowerCase();

  if (value === 'notlogged' || value === 'not_connected' || value === 'offline' || value === 'initializing') {
    return 'Not connected';
  }
  if (value.includes('qr') || value.includes('scan') || value.includes('pairing')) {
    return 'Waiting for QR scan';
  }
  if (value.includes('connecting') || value.includes('authenticating') || value.includes('pairing')) {
    return 'Authenticating';
  }
  if (value === 'islogged' || value === 'connected' || value.includes('logged')) {
    return 'Connected';
  }
  if (value.includes('disconnected') || value.includes('browserclose') || value.includes('delete') || value.includes('serverclose')) {
    return 'Disconnected';
  }

  return 'Not connected';
}

function uiStatusFromState(rawStatus) {
  const normalized = String(rawStatus || 'notLogged').trim();
  const value = normalized.toLowerCase();

  if (value === 'connecting') return 'Connecting';
  if (value === 'pairing' || value.includes('auth')) return 'Authenticating';
  if (value.includes('qr') || value.includes('scan')) return 'Waiting for QR scan';
  if (value === 'islogged' || value === 'connected' || value.includes('logged')) return 'Connected';
  if (value.includes('disconnected') || value.includes('browserclose') || value.includes('delete') || value.includes('serverclose')) return 'Disconnected';
  return mapStatus(normalized);
}

// ============================================
// Firebase token + UID authorization
// ============================================

async function verifyFirebaseToken(req) {
  const authHeader = String(req.headers.authorization || '');
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token && ALLOW_LOCAL_DEV) {
    const uid = String(req.headers['x-user-id'] || 'local-dev-user');
    if (uid && uid !== 'undefined') {
      return {
        uid,
        localDev: true,
        email: null,
        token: null,
        exp: Math.floor(Date.now() / 1000) + 3600
      };
    }
  }

  if (!token) {
    const err = new Error('Missing Firebase auth token.');
    err.statusCode = 401;
    throw err;
  }

  try {
    const verified = await jwtVerify(token, FIREBASE_JWKS, {
      issuer: FIREBASE_ISSUER,
      audience: FIREBASE_PROJECT_ID
    });

    const payload = verified.payload || {};
    if (!payload.sub) {
      const err = new Error('Firebase token subject is missing.');
      err.statusCode = 401;
      throw err;
    }

    return {
      uid: String(payload.sub),
      email: payload.email ? String(payload.email) : null,
      localDev: false,
      token,
      issuer: payload.iss ? String(payload.iss) : null,
      audience: payload.aud ? String(payload.aud) : null,
      exp: Number(payload.exp || 0)
    };
  } catch (error) {
    const message = error && error.message ? error.message : 'Firebase token verification failed.';
    const err = new Error(message);
    err.statusCode = 401;
    throw err;
  }
}

async function authorizeUser(req) {
  const identity = await verifyFirebaseToken(req);
  return {
    uid: identity.uid,
    email: identity.email || null,
    localDev: !!identity.localDev
  };
}

// ============================================
// Message normalization + per-user store
// ============================================

function normalizeChatId(value) {
  const raw = typeof value === 'object' && value !== null ? (value._serialized || value.id || '') : String(value || '');
  return raw;
}

function normalizeMessage(message) {
  if (!message || typeof message !== 'object') return null;

  const fromMe = !!(message.fromMe || (message.id && message.id.fromMe));
  const from = normalizeChatId(message.from);
  const to = normalizeChatId(message.to);
  const chatId = normalizeChatId(message.chatId) || (fromMe ? to : from);
  const timestampMs = message.timestamp
    ? Number(message.timestamp) * 1000
    : (message.t ? Number(message.t) * 1000 : Date.now());

  const sender = message.sender || {};
  const normalized = {
    id: (message.id && (message.id._serialized || message.id.id)) || String(message.id || `m_${timestampMs}`),
    chatId,
    from,
    to,
    fromMe,
    type: String(message.type || 'chat'),
    body: typeof message.body === 'string' ? message.body : (message.caption || ''),
    caption: message.caption || null,
    mimetype: message.mimetype || null,
    filename: message.filename || null,
    mediaUrl: message.mediaUrl || null,
    deprecatedMms3Url: message.deprecatedMms3Url || null,
    isGroupMsg: !!message.isGroupMsg,
    ack: typeof message.ack === 'number' ? message.ack : null,
    timestamp: timestampMs,
    sender: {
      id: normalizeChatId(sender.id) || from,
      name: sender.name || sender.pushname || sender.shortName || null,
      pushname: sender.pushname || null
    }
  };

  normalized.hasMedia = !!(normalized.mimetype && normalized.type !== 'chat' && normalized.type !== 'revoked');
  return normalized;
}

function storeMessage(meta, normalized) {
  if (!normalized || !normalized.chatId) return;

  if (!meta.messageStore.has(normalized.chatId)) {
    meta.messageStore.set(normalized.chatId, []);
  }
  const list = meta.messageStore.get(normalized.chatId);

  // De-duplicate by message id (WPPConnect can re-emit on reconnect)
  if (!list.some(m => m.id === normalized.id)) {
    list.push(normalized);
    list.sort((a, b) => a.timestamp - b.timestamp);
    if (list.length > MAX_MESSAGES_PER_CHAT) {
      list.splice(0, list.length - MAX_MESSAGES_PER_CHAT);
    }
  }

  meta.eventSeq += 1;
  meta.events.push({
    seq: meta.eventSeq,
    type: 'message',
    message: normalized,
    timestamp: new Date().toISOString()
  });
  if (meta.events.length > MAX_EVENTS_PER_WORKSPACE) {
    meta.events.splice(0, meta.events.length - MAX_EVENTS_PER_WORKSPACE);
  }
}

function getStoredMessages(meta, chatId, limit) {
  const list = meta.messageStore.get(chatId) || [];
  const max = Math.max(1, Math.min(Number(limit) || 50, MAX_MESSAGES_PER_CHAT));
  return list.slice(-max);
}

// ============================================
// WPPConnect client lifecycle
// ============================================

async function readClientAccountInfo(client) {
  const account = {};
  try {
    if (client && typeof client.getHostDevice === 'function') {
      const hostDevice = await client.getHostDevice();
      account.device = hostDevice || null;
    }
  } catch (error) {}

  try {
    if (client && typeof client.getWid === 'function') {
      account.wid = await client.getWid();
    }
  } catch (error) {}

  try {
    if (client && typeof client.getMyProfile === 'function') {
      const profile = await client.getMyProfile();
      account.profile = profile || null;
    }
  } catch (error) {}

  return account;
}

function attachClientHandlers(client, meta) {
  client.onMessage(async (message) => {
    try {
      const normalized = normalizeMessage(message);
      if (normalized) {
        storeMessage(meta, normalized);
        meta.updatedAt = new Date().toISOString();
      }
    } catch (error) {
      meta.lastError = String(error && error.message ? error.message : error);
    }
  });

  if (typeof client.onAck === 'function') {
    client.onAck(async (ack) => {
      try {
        if (!ack) return;
        const messageId = (ack.id && (ack.id._serialized || ack.id.id)) || null;
        if (!messageId) return;
        for (const list of meta.messageStore.values()) {
          const found = list.find(m => m.id === messageId);
          if (found) {
            found.ack = typeof ack.ack === 'number' ? ack.ack : found.ack;
            break;
          }
        }
      } catch (error) {}
    });
  }

  client.onStateChange(async (state) => {
    meta.status = String(state || meta.status || 'notLogged');
    meta.updatedAt = new Date().toISOString();
    if (state === 'isLogged') {
      meta.connectedAt = new Date().toISOString();
      meta.qr = null;
      meta.pairingCode = null;
    }
  });
}

async function createClient(meta, options = {}) {
  const client = await getWppconnect().create({
    session: meta.sessionName,
    headless: true,
    debug: false,
    logQR: false,
    updatesLog: false,
    autoClose: 0,
    useChrome: false,
    puppeteerOptions: process.env.PUPPETEER_EXECUTABLE_PATH
      ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
      : {},
    chromeVersion: 'stable',
    tokenStore: 'file',
    folderNameToken: path.join(SESSIONS_DIR, meta.sessionName),
    // Pairing-code login: only used when a phone number was supplied.
    ...(options.phoneNumber ? { phoneNumber: String(options.phoneNumber).replace(/\D+/g, '') } : {}),
    catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
      const data = base64Qr && base64Qr.startsWith('data:image') ? base64Qr : `data:image/png;base64,${base64Qr || ''}`;
      meta.qr = data;
      meta.status = 'qrReadSuccess';
      meta.updatedAt = new Date().toISOString();
    },
    catchLinkCode: (code) => {
      meta.pairingCode = code || null;
      meta.status = 'pairing';
      meta.updatedAt = new Date().toISOString();
    },
    statusFind: (statusSession, session) => {
      meta.status = String(statusSession || 'notLogged');
      meta.updatedAt = new Date().toISOString();
      if (meta.status === 'isLogged') {
        meta.connectedAt = new Date().toISOString();
        meta.qr = null;
        meta.pairingCode = null;
      }
      if (meta.status === 'disconnectedMobile' || meta.status === 'deleteToken' || meta.status === 'browserClose') {
        meta.qr = null;
        meta.pairingCode = null;
      }
    }
  });

  meta.client = client;
  meta.updatedAt = new Date().toISOString();
  attachClientHandlers(client, meta);
  return client;
}

/**
 * Returns a connected-or-connecting WPPConnect client for the workspace.
 * Concurrent calls share one in-flight create() promise so we never spawn
 * two Chromium instances for the same session.
 */
async function ensureClientForUser(uid, options = {}) {
  const meta = getSessionMeta(uid);

  if (meta.client) {
    return meta.client;
  }

  if (meta.creating) {
    return meta.creating;
  }

  meta.creating = createClient(meta, options)
    .then(client => client)
    .catch(error => {
      meta.lastError = String(error && error.message ? error.message : error);
      meta.status = 'notLogged';
      throw error;
    })
    .finally(() => {
      meta.creating = null;
    });

  return meta.creating;
}

async function getUserStatus(uid) {
  const meta = getSessionMeta(uid);

  // Auto-resume a persisted session in the background so a plain status
  // poll reconnects WhatsApp after a service restart.
  if (!meta.client && !meta.creating && hasStoredToken(uid)) {
    ensureClientForUser(uid).catch(() => {});
  }

  if (!meta.client) {
    return {
      uid,
      sessionName: getSessionName(uid),
      connectionStatus: meta.creating ? 'initializing' : 'notLogged',
      status: meta.creating ? 'Connecting' : 'Not connected',
      statusText: meta.creating ? 'Connecting' : 'Not connected',
      connected: false,
      qr: meta.qr || null,
      pairingCode: meta.pairingCode || null,
      hasStoredSession: hasStoredToken(uid),
      lastUpdatedAt: meta.updatedAt,
      account: null
    };
  }

  try {
    const connectionState = typeof meta.client.getConnectionState === 'function'
      ? await meta.client.getConnectionState()
      : meta.status;

    const nextStatus = String(connectionState || meta.status || 'notLogged');
    meta.status = nextStatus;
    meta.updatedAt = new Date().toISOString();
    const account = await readClientAccountInfo(meta.client);

    return {
      uid,
      sessionName: getSessionName(uid),
      connectionStatus: nextStatus,
      status: mapStatus(nextStatus),
      statusText: uiStatusFromState(nextStatus),
      connected: nextStatus === 'isLogged' || nextStatus === 'CONNECTED' || nextStatus.toLowerCase() === 'islogged',
      qr: meta.qr || null,
      pairingCode: meta.pairingCode || null,
      hasStoredSession: true,
      lastUpdatedAt: meta.updatedAt,
      connectedAt: meta.connectedAt,
      account
    };
  } catch (error) {
    meta.lastError = String(error && error.message ? error.message : error);
    return {
      uid,
      sessionName: getSessionName(uid),
      connectionStatus: meta.status || 'notLogged',
      status: mapStatus(meta.status || 'notLogged'),
      statusText: uiStatusFromState(meta.status || 'notLogged'),
      connected: false,
      qr: meta.qr || null,
      pairingCode: meta.pairingCode || null,
      hasStoredSession: hasStoredToken(uid),
      lastUpdatedAt: meta.updatedAt,
      connectedAt: meta.connectedAt,
      error: meta.lastError,
      account: null
    };
  }
}

async function disconnectUserSession(uid) {
  const meta = getSessionMeta(uid);
  if (meta.client && typeof meta.client.logout === 'function') {
    await meta.client.logout();
  }
  if (meta.client && typeof meta.client.close === 'function') {
    try { await meta.client.close(); } catch (error) {}
  }

  meta.client = null;
  meta.creating = null;
  meta.status = 'notLogged';
  meta.qr = null;
  meta.pairingCode = null;
  meta.connectedAt = null;
  meta.updatedAt = new Date().toISOString();
  meta.lastError = null;
  meta.messageStore = new Map();
  meta.events = [];
  meta.eventSeq = 0;

  const proprietaryTokenDir = path.join(SESSIONS_DIR, getSessionName(uid));
  if (fs.existsSync(proprietaryTokenDir)) {
    try {
      fs.rmSync(proprietaryTokenDir, { recursive: true, force: true });
    } catch (error) {}
  }

  return {
    uid,
    disconnected: true,
    status: 'Not connected'
  };
}

// ============================================
// HTTP layer
// ============================================

const defaultOrigins = [
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
];
const envOrigins = String(process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...envOrigins]);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id']
}));
// 25mb to carry base64 media payloads
app.use(express.json({ limit: '25mb' }));

// The Render service hosts the static OnePlace frontend alongside this API.
app.use('/whatsapp-service', (req, res) => res.status(404).end());
app.use(express.static(FRONTEND_DIR, {
  dotfiles: 'deny',
  index: 'index.html'
}));

function handleError(res, error, fallbackMessage, code) {
  const message = error && error.message ? error.message : fallbackMessage;
  console.error(`[${code}]`, error);
  res.status(error.statusCode || 500).json({ success: false, message, code });
}

// ---------- Health ----------

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp-service' });
});

app.get('/api/whatsapp/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp' });
});

// ---------- Status / connection ----------

app.get('/api/whatsapp/status', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const status = await getUserStatus(access.uid);
    res.json({ success: true, ...status });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp status.', 'WHATSAPP_STATUS_ERROR');
  }
});

app.get('/api/whatsapp/connect', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Use POST /api/whatsapp/connect for WhatsApp connection.',
    code: 'WHATSAPP_CONNECT_METHOD_NOT_ALLOWED'
  });
});

app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const phoneNumber = req.body && req.body.phoneNumber ? String(req.body.phoneNumber) : null;
    const meta = getSessionMeta(access.uid);
    const clientOptions = phoneNumber ? { phoneNumber } : {};

    if (!meta.client && !meta.creating) {
      meta.status = 'initializing';
      meta.updatedAt = new Date().toISOString();
      setImmediate(() => {
        ensureClientForUser(access.uid, clientOptions).catch(error => {
          console.error('[WHATSAPP_CONNECT_BACKGROUND_ERROR]', error);
        });
      });
    }

    const status = {
      uid: access.uid,
      sessionName: meta.sessionName,
      connectionStatus: meta.client ? meta.status : 'initializing',
      status: meta.client ? uiStatusFromState(meta.status) : 'Connecting',
      statusText: meta.client ? uiStatusFromState(meta.status) : 'Connecting',
      connected: !!meta.client && uiStatusFromState(meta.status) === 'Connected',
      account: meta.client ? await readClientAccountInfo(meta.client) : null,
      qr: meta.qr || null,
      pairingCode: meta.pairingCode || null
    };

    res.json({
      success: true,
      uid: access.uid,
      sessionName: getSessionName(access.uid),
      qr: status.qr || null,
      pairingCode: status.pairingCode || null,
      status: status.status,
      statusText: status.statusText,
      connectionStatus: status.connectionStatus,
      connected: !!status.connected,
      account: status.account || null
    });
  } catch (error) {
    handleError(res, error, 'Unable to connect WhatsApp.', 'WHATSAPP_CONNECT_ERROR');
  }
});

app.get('/api/whatsapp/qr', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const status = await getUserStatus(access.uid);
    res.json({
      success: true,
      qr: status.qr || null,
      pairingCode: status.pairingCode || null,
      status: status.status,
      statusText: status.statusText,
      connected: !!status.connected
    });
  } catch (error) {
    handleError(res, error, 'Unable to fetch WhatsApp QR.', 'WHATSAPP_QR_ERROR');
  }
});

app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const result = await disconnectUserSession(access.uid);
    res.json({ success: true, ...result });
  } catch (error) {
    handleError(res, error, 'Unable to disconnect WhatsApp.', 'WHATSAPP_DISCONNECT_ERROR');
  }
});

// ---------- Chats / contacts ----------

app.get('/api/whatsapp/chats', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const client = await ensureClientForUser(access.uid);
    const chats = typeof client.getAllChats === 'function' ? await client.getAllChats() : [];
    res.json({ success: true, chats });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp chats.', 'WHATSAPP_CHATS_ERROR');
  }
});

app.get('/api/whatsapp/chats/:chatId/messages', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const chatId = decodeURIComponent(req.params.chatId);
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 200));
    const meta = getSessionMeta(access.uid);

    let messages = [];
    if (meta.client && typeof meta.client.getMessages === 'function') {
      try {
        const raw = await meta.client.getMessages(chatId, { count: limit });
        messages = (Array.isArray(raw) ? raw : [])
          .map(normalizeMessage)
          .filter(Boolean);
      } catch (error) {
        messages = [];
      }
    }

    // Merge with the live store (covers messages received since connect)
    const stored = getStoredMessages(meta, chatId, limit);
    const byId = new Map();
    [...messages, ...stored].forEach(m => byId.set(m.id, m));
    messages = Array.from(byId.values()).sort((a, b) => a.timestamp - b.timestamp).slice(-limit);

    res.json({ success: true, chatId, messages });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp messages.', 'WHATSAPP_MESSAGES_ERROR');
  }
});

app.get('/api/whatsapp/contacts', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const client = await ensureClientForUser(access.uid);
    const contacts = typeof client.getAllContacts === 'function' ? await client.getAllContacts() : [];
    res.json({ success: true, contacts });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp contacts.', 'WHATSAPP_CONTACTS_ERROR');
  }
});

// ---------- Sending ----------

app.post('/api/whatsapp/messages', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const { to, text } = req.body || {};

    if (!to || !text) {
      return res.status(400).json({ success: false, message: 'Recipient and message text are required.' });
    }

    const client = await ensureClientForUser(access.uid);

    if (typeof client.sendText !== 'function') {
      return res.status(400).json({ success: false, message: 'WhatsApp sendText is unavailable in the current session.' });
    }

    const result = await client.sendText(to, text);

    const meta = getSessionMeta(access.uid);
    storeMessage(meta, {
      id: (result && result.id && (result.id._serialized || result.id.id)) || `out_${Date.now()}`,
      chatId: String(to),
      from: 'me',
      to: String(to),
      fromMe: true,
      type: 'chat',
      body: String(text),
      caption: null,
      mimetype: null,
      filename: null,
      isGroupMsg: String(to).endsWith('@g.us'),
      ack: result && typeof result.ack === 'number' ? result.ack : 1,
      timestamp: Date.now(),
      sender: { id: 'me', name: null, pushname: null },
      hasMedia: false
    });

    res.json({ success: true, result });
  } catch (error) {
    handleError(res, error, 'Unable to send WhatsApp message.', 'WHATSAPP_MESSAGE_ERROR');
  }
});

app.post('/api/whatsapp/messages/media', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const { to, base64, filename, mimetype, caption, kind } = req.body || {};

    if (!to || !base64) {
      return res.status(400).json({ success: false, message: 'Recipient (to) and base64 media are required.' });
    }

    const client = await ensureClientForUser(access.uid);
    const mediaKind = String(kind || 'file').toLowerCase();
    const name = filename || `file-${Date.now()}`;
    let result;

    if (mediaKind === 'image' && typeof client.sendImage === 'function') {
      result = await client.sendImage(to, base64, name, caption || '');
    } else if ((mediaKind === 'ptt' || mediaKind === 'audio' || mediaKind === 'voice') && typeof client.sendPttFromBase64 === 'function') {
      result = await client.sendPttFromBase64(to, base64, name, caption || '');
    } else if (typeof client.sendFile === 'function') {
      result = await client.sendFile(to, base64, { filename: name, caption: caption || '' });
    } else {
      return res.status(400).json({ success: false, message: 'WhatsApp media sending is unavailable in the current session.' });
    }

    const meta = getSessionMeta(access.uid);
    storeMessage(meta, {
      id: (result && result.id && (result.id._serialized || result.id.id)) || `out_${Date.now()}`,
      chatId: String(to),
      from: 'me',
      to: String(to),
      fromMe: true,
      type: mediaKind === 'image' ? 'image' : (mediaKind === 'ptt' || mediaKind === 'audio' || mediaKind === 'voice') ? 'ptt' : 'document',
      body: caption || '',
      caption: caption || null,
      mimetype: mimetype || null,
      filename: name,
      isGroupMsg: String(to).endsWith('@g.us'),
      ack: 1,
      timestamp: Date.now(),
      sender: { id: 'me', name: null, pushname: null },
      hasMedia: true
    });

    res.json({ success: true, result });
  } catch (error) {
    handleError(res, error, 'Unable to send WhatsApp media.', 'WHATSAPP_MEDIA_ERROR');
  }
});

// ---------- Media download ----------

app.get('/api/whatsapp/media/:messageId', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const messageId = decodeURIComponent(req.params.messageId);
    const meta = getSessionMeta(access.uid);

    if (!meta.client || typeof meta.client.downloadMedia !== 'function') {
      return res.status(400).json({ success: false, message: 'WhatsApp media download is unavailable in the current session.' });
    }

    const base64 = await meta.client.downloadMedia(messageId);
    if (!base64) {
      return res.status(404).json({ success: false, message: 'Media not found for this message.' });
    }

    const dataUrl = base64.startsWith('data:') ? base64 : `data:application/octet-stream;base64,${base64}`;
    res.json({ success: true, messageId, dataUrl });
  } catch (error) {
    handleError(res, error, 'Unable to download WhatsApp media.', 'WHATSAPP_MEDIA_DOWNLOAD_ERROR');
  }
});

// ---------- Event feed (polling) ----------

app.get('/api/whatsapp/events', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const meta = getSessionMeta(access.uid);
    const since = Math.max(0, Number(req.query.since) || 0);
    const events = meta.events.filter(e => e.seq > since);
    const status = await getUserStatus(access.uid);

    res.json({
      success: true,
      events,
      lastSeq: meta.eventSeq,
      connectionStatus: status.connectionStatus,
      connected: !!status.connected
    });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp events.', 'WHATSAPP_EVENTS_ERROR');
  }
});

app.listen(PORT, () => {
  console.log(`OnePlace WhatsApp service listening on http://localhost:${PORT}`);
});