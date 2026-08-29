/**
 * OnePlace Enterprise — WhatsApp Service (WPPConnect Server Proxy)
 *
 * Express microservice that proxies authenticated OnePlace users to a
 * WPPConnect Server instance. Each Firebase user gets their own session.
 *
 * Auth: Firebase ID token (Authorization: Bearer ...) or X-User-Id in dev.
 *
 * Architecture:
 *   Frontend → this service (port 3001) → WPPConnect Server (port 21465)
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { jwtVerify, createRemoteJWKSet } = require('jose');

const app = express();
const PORT = Number(process.env.PORT || 3001);
const FRONTEND_DIR = require('path').resolve(__dirname, '..');

// WPPConnect Server configuration
const WPPCONNECT_URL = (process.env.WPPCONNECT_SERVER_URL || 'http://localhost:21465').replace(/\/+$/, '');
const WPPCONNECT_SECRET = process.env.WPPCONNECT_SECRET_KEY || 'THISISMYSECURETOKEN';
const WPPCONNECT_CONFIGURED = !!process.env.WPPCONNECT_SERVER_URL;
const ALLOW_LOCAL_DEV = process.env.ALLOW_LOCAL_DEV === 'true';
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'oneplace-c3ac8';
const FIREBASE_ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
const FIREBASE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

// In-memory caps
const MAX_MESSAGES_PER_CHAT = Number(process.env.WHATSAPP_MAX_MESSAGES_PER_CHAT || 500);
const MAX_EVENTS_PER_WORKSPACE = Number(process.env.WHATSAPP_MAX_EVENTS || 1000);

// Session registry: sessionName -> metadata
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
      tokenFull: null,
      tokenCreating: null,
      status: 'notLogged',
      qr: null,
      connectedAt: null,
      updatedAt: null,
      lastError: null,
      messageStore: new Map(),
      events: [],
      eventSeq: 0
    });
  }
  return sessions.get(sessionName);
}

// ============================================
// Phone / chat ID normalization
// ============================================

function normalizePhone(chatId) {
  return String(chatId || '').replace(/@[cg]\.us$/, '').replace(/@.*$/, '');
}

function isGroupChat(chatId) {
  return String(chatId || '').endsWith('@g.us');
}

// ============================================
// WPPConnect Server API client
// ============================================

async function wppRequest(sessionName, method, path, data = null, options = {}) {
  const meta = sessions.get(sessionName);
  if (!meta || !meta.tokenFull) {
    throw Object.assign(new Error('WPPConnect Server session token not available.'), { statusCode: 503 });
  }

  const url = `${WPPCONNECT_URL}/api/${encodeURIComponent(sessionName)}${path}`;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${meta.tokenFull}`
  };
  if (data !== null && data !== undefined) headers['Content-Type'] = 'application/json';

  try {
    const request = { method, url, headers, timeout: options.timeout || 30000, responseType: options.responseType };
    if (data !== null && data !== undefined) request.data = data;
    const response = await axios(request);
    return response.data;
  } catch (error) {
    if (error.response) {
      const err = new Error(error.response.data?.message || `WPPConnect Server error (${error.response.status})`);
      err.statusCode = error.response.status;
      err.wppStatus = error.response.status;
      err.wppData = error.response.data;
      throw err;
    }
    throw error;
  }
}

async function ensureSessionToken(meta) {
  if (meta.tokenFull) return meta.tokenFull;
  if (meta.tokenCreating) return meta.tokenCreating;

  if (!WPPCONNECT_CONFIGURED && process.env.NODE_ENV === 'production') {
    throw Object.assign(new Error('WPPCONNECT_SERVER_URL is not configured on the WhatsApp service.'), { statusCode: 503 });
  }

  meta.tokenCreating = (async () => {
    try {
      const url = `${WPPCONNECT_URL}/api/${encodeURIComponent(meta.sessionName)}/${encodeURIComponent(WPPCONNECT_SECRET)}/generate-token`;
      const { data } = await axios.post(url, null, { headers: { 'Accept': 'application/json' }, timeout: 15000 });
      if (!data || !data.full) {
        throw new Error('WPPConnect Server token generation returned invalid payload.');
      }
      // WPPConnect expects only the hash in the Bearer header; data.full is
      // the session and hash combined for the alternate session-token format.
      meta.tokenFull = data.token || String(data.full).split(':').slice(1).join(':');
      if (!meta.tokenFull) {
        throw new Error('WPPConnect Server token generation returned no access token.');
      }
      meta.updatedAt = new Date().toISOString();
      return meta.tokenFull;
    } catch (error) {
      meta.lastError = String(error?.message || error);
      throw error;
    } finally {
      meta.tokenCreating = null;
    }
  })();

  return meta.tokenCreating;
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
      return { uid, localDev: true, email: null, token: null, exp: Math.floor(Date.now() / 1000) + 3600 };
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
      exp: Number(payload.exp || 0)
    };
  } catch (error) {
    const message = error?.message || 'Firebase token verification failed.';
    const err = new Error(message);
    err.statusCode = 401;
    throw err;
  }
}

async function authorizeUser(req) {
  const identity = await verifyFirebaseToken(req);
  return { uid: identity.uid, email: identity.email || null, localDev: !!identity.localDev };
}

// ============================================
// Message normalization + per-user store
// ============================================

function normalizeChatId(value) {
  if (!value) return '';
  if (typeof value === 'object') return value._serialized || value.id || '';
  return String(value);
}

function normalizeMessage(message) {
  if (!message || typeof message !== 'object') return null;

  const fromMe = !!(message.fromMe || (message.id && message.id.fromMe));
  const from = normalizeChatId(message.from);
  const to = normalizeChatId(message.to);
  const chatId = normalizeChatId(message.chatId) || (fromMe ? to : from) || normalizeChatId(message.id?._serialized);
  const timestampMs = message.timestamp
    ? Number(message.timestamp) * 1000
    : (message.t ? Number(message.t) * 1000 : Date.now());

  const sender = message.sender || {};
  const normalized = {
    id: normalizeChatId(message.id) || `m_${timestampMs}`,
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
    isGroupMsg: !!message.isGroupMsg || isGroupChat(chatId),
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

function normalizeWppMessage(msg) {
  if (!msg) return null;
  return normalizeMessage(msg);
}

function storeMessage(meta, normalized) {
  if (!normalized || !normalized.chatId) return;

  if (!meta.messageStore.has(normalized.chatId)) {
    meta.messageStore.set(normalized.chatId, []);
  }
  const list = meta.messageStore.get(normalized.chatId);

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
// Status mapping
// ============================================

function mapStatus(status) {
  const normalized = String(status || 'notLogged').trim().toLowerCase();
  if (['notlogged', 'not_connected', 'offline', 'initializing', 'false'].includes(normalized)) return 'Not connected';
  if (normalized.includes('qr') || normalized.includes('scan')) return 'Waiting for QR scan';
  if (normalized.includes('connecting') || normalized.includes('authenticating') || normalized.includes('pairing')) return 'Authenticating';
  if (['islogged', 'connected', 'true', 'loggedin'].includes(normalized) || normalized.includes('logged')) return 'Connected';
  if (normalized.includes('disconnected') || normalized.includes('browserclose') || normalized.includes('delete') || normalized.includes('serverclose')) return 'Disconnected';
  return 'Not connected';
}

function uiStatusFromState(rawStatus) {
  const normalized = String(rawStatus || 'notLogged').trim().toLowerCase();
  if (normalized === 'connecting' || normalized === 'starting') return 'Connecting';
  if (normalized === 'pairing' || normalized.includes('auth')) return 'Authenticating';
  if (normalized.includes('qr') || normalized.includes('scan')) return 'Waiting for QR scan';
  if (['islogged', 'connected', 'true', 'loggedin'].includes(normalized) || normalized.includes('logged')) return 'Connected';
  if (normalized.includes('disconnected') || normalized.includes('browserclose') || normalized.includes('delete') || normalized.includes('serverclose')) return 'Disconnected';
  return mapStatus(normalized);
}

// ============================================
// WPPConnect Server session lifecycle
// ============================================

function extractQrCode(payload) {
  if (Buffer.isBuffer(payload)) return `data:image/png;base64,${payload.toString('base64')}`;
  if (payload instanceof Uint8Array) return `data:image/png;base64,${Buffer.from(payload).toString('base64')}`;
  const candidates = [
    payload?.qrcode,
    payload?.qr,
    payload?.response?.qrcode,
    payload?.response?.qr,
    payload?.data?.qrcode,
    payload?.data?.qr
  ];
  const value = candidates.find(candidate => typeof candidate === 'string' && candidate.trim());
  if (!value) return null;
  return value.startsWith('data:') ? value : `data:image/png;base64,${value}`;
}

async function refreshQrCode(meta) {
  try {
    console.log(`[refreshQrCode] Requesting /qrcode-session for ${meta.sessionName}...`);
    const image = await wppRequest(meta.sessionName, 'get', '/qrcode-session', null, { responseType: 'arraybuffer' });
    const imageQr = extractQrCode(image);
    if (imageQr) {
      meta.qr = imageQr;
      meta.status = 'qrReadSuccess';
      meta.updatedAt = new Date().toISOString();
      console.log(`[refreshQrCode] QR code found via /qrcode-session, length: ${imageQr.length}`);
      return true;
    }
  } catch (error) {
    console.log(`[refreshQrCode] /qrcode-session failed for ${meta.sessionName}: ${error.message}`);
  }

  try {
    console.log(`[refreshQrCode] Requesting /qr-code for ${meta.sessionName}...`);
    const jsonResponse = await wppRequest(meta.sessionName, 'get', '/qr-code');
    const jsonQr = extractQrCode(jsonResponse);
    if (jsonQr) {
      meta.qr = jsonQr;
      meta.status = 'qrReadSuccess';
      meta.updatedAt = new Date().toISOString();
      console.log(`[refreshQrCode] QR code found via /qr-code, length: ${jsonQr.length}`);
      return true;
    }
  } catch (error) {
    console.log(`[refreshQrCode] /qr-code failed for ${meta.sessionName}: ${error.message}`);
  }
  return false;
}

async function readClientAccountInfo(sessionName) {
  const account = {};
  try {
    const data = await wppRequest(sessionName, 'get', '/host-device');
    account.device = data?.response || data || null;
  } catch (e) {}
  try {
    const data = await wppRequest(sessionName, 'get', '/get-wid');
    account.wid = data?.response || data || null;
  } catch (e) {}
  try {
    const data = await wppRequest(sessionName, 'get', '/get-profile-status');
    account.profile = data?.response || data || null;
  } catch (e) {}
  return account;
}

async function ensureClientForUser(uid) {
  const meta = getSessionMeta(uid);
  await ensureSessionToken(meta);

  if (['starting', 'connecting', 'qrReadSuccess'].includes(meta.status)) {
    console.log(`[ensureClientForUser] Session ${meta.sessionName} already starting, skipping /start-session`);
    return meta;
  }

  meta.qr = null;
  meta.lastError = null;
  meta.status = 'starting';
  meta.updatedAt = new Date().toISOString();

  try {
    console.log(`[ensureClientForUser] Starting session for ${meta.sessionName}...`);
    const startResp = await wppRequest(meta.sessionName, 'post', '/start-session', {
      webhook: process.env.WEBHOOK_URL || undefined,
      waitQrCode: true
    });
    console.log(`[ensureClientForUser] WPPConnect /start-session full response:`, JSON.stringify(startResp, null, 2));
    const startQr = extractQrCode(startResp);
    console.log(`[ensureClientForUser] Start response status: ${startResp?.status}, has qrcode: ${!!startQr}`);
    
    if (startQr) {
      console.log(`[ensureClientForUser] Processing QRCODE response...`);
      meta.qr = startQr;
      meta.status = 'qrReadSuccess';
      meta.updatedAt = new Date().toISOString();
      console.log(`[ensureClientForUser] ✓ QR code set, length: ${meta.qr.length}`);
    } else if (startResp?.status === 'CONNECTED' || startResp?.status === 'isLogged') {
      console.log(`[ensureClientForUser] Session already logged in (status: ${startResp?.status})`);
      meta.status = 'isLogged';
      meta.connectedAt = meta.connectedAt || new Date().toISOString();
      meta.qr = null;
      meta.updatedAt = new Date().toISOString();
      console.log(`[ensureClientForUser] Session already logged in`);
    } else if (startResp?.status) {
      console.log(`[ensureClientForUser] Unhandled status: ${startResp.status} (not QRCODE, not CONNECTED, not isLogged)`);
      meta.status = String(startResp.status);
      meta.updatedAt = new Date().toISOString();
      console.log(`[ensureClientForUser] Status set to: ${meta.status}`);
      
      // Try to fetch QR code if status is pending
      if (startResp.status !== 'CONNECTED' && startResp.status !== 'isLogged') {
        try {
          console.log(`[ensureClientForUser] Attempting to fetch QR code via /qr-code endpoint...`);
          const qrResp = await wppRequest(meta.sessionName, 'get', '/qr-code');
          console.log(`[ensureClientForUser] /qr-code response:`, JSON.stringify(qrResp, null, 2));
          const fallbackQr = extractQrCode(qrResp);
          if (fallbackQr) {
            meta.qr = fallbackQr;
            console.log(`[ensureClientForUser] ✓ QR code fetched via fallback, length: ${meta.qr.length}`);
          } else {
            console.log(`[ensureClientForUser] ✗ /qr-code returned no qrcode field`);
          }
        } catch (qrErr) {
          console.error(`[ensureClientForUser] ✗ Could not fetch QR code: ${qrErr.message}`);
        }
      }
    } else {
      console.log(`[ensureClientForUser] No status in response!`, JSON.stringify(startResp, null, 2));
    }
  } catch (error) {
    console.error(`[ensureClientForUser] Error for ${meta.sessionName}:`, error.message);
    if (error.wppStatus !== 400 && error.wppStatus !== 409) {
      meta.lastError = String(error?.message || error);
    }
  }

  return meta;
}

async function getUserStatus(uid) {
  const meta = getSessionMeta(uid);

  if (!meta.tokenFull) {
    ensureSessionToken(meta).catch(() => {});
    return {
      uid,
      sessionName: meta.sessionName,
      connectionStatus: 'notLogged',
      status: 'Not connected',
      statusText: 'Not connected',
      connected: false,
      qr: meta.qr || null,
      pairingCode: null,
      hasStoredSession: false,
      lastUpdatedAt: meta.updatedAt,
      account: null
    };
  }

  try {
    const statusResp = await wppRequest(meta.sessionName, 'get', '/check-connection-session');
    const isConnected = !!(statusResp?.response === true || statusResp?.status === true || statusResp?.response?.connected === true);

    meta.status = isConnected ? 'isLogged' : (meta.status || 'notLogged');
    meta.updatedAt = new Date().toISOString();

    if (!isConnected && !meta.qr) await refreshQrCode(meta);

    let account = null;
    if (isConnected) {
      meta.connectedAt = meta.connectedAt || new Date().toISOString();
      account = await readClientAccountInfo(meta.sessionName);
    }

    return {
      uid,
      sessionName: meta.sessionName,
      connectionStatus: meta.status,
      status: mapStatus(meta.status),
      statusText: uiStatusFromState(meta.status),
      connected: isConnected,
      qr: meta.qr || null,
      pairingCode: null,
      hasStoredSession: !!meta.tokenFull,
      lastUpdatedAt: meta.updatedAt,
      connectedAt: meta.connectedAt,
      account,
      diagnostic: {
        rawStatus: statusResp?.status,
        rawResponse: statusResp?.response,
        metaStatus: meta.status,
        lastError: meta.lastError,
        qrPresent: !!meta.qr
      }
    };
  } catch (error) {
    meta.lastError = String(error?.message || error);
    return {
      uid,
      sessionName: meta.sessionName,
      connectionStatus: meta.status || 'notLogged',
      status: mapStatus(meta.status || 'notLogged'),
      statusText: uiStatusFromState(meta.status || 'notLogged'),
      connected: false,
      qr: meta.qr || null,
      pairingCode: null,
      hasStoredSession: !!meta.tokenFull,
      lastUpdatedAt: meta.updatedAt,
      connectedAt: meta.connectedAt,
      error: meta.lastError,
      account: null,
      diagnostic: {
        metaStatus: meta.status,
        lastError: meta.lastError,
        qrPresent: !!meta.qr
      }
    };
  }
}

async function disconnectUserSession(uid) {
  const meta = getSessionMeta(uid);
  try {
    if (meta.tokenFull) {
      await wppRequest(meta.sessionName, 'post', '/logout-session');
    }
  } catch (e) {}

  meta.tokenFull = null;
  meta.tokenCreating = null;
  meta.status = 'notLogged';
  meta.qr = null;
  meta.connectedAt = null;
  meta.updatedAt = new Date().toISOString();
  meta.lastError = null;
  meta.messageStore = new Map();
  meta.events = [];
  meta.eventSeq = 0;

  return { uid, disconnected: true, status: 'Not connected' };
}

// ============================================
// HTTP layer
// ============================================

const defaultOrigins = [
  'http://localhost:8000', 'http://127.0.0.1:8000',
  'http://localhost:3001', 'http://127.0.0.1:3001',
  'http://localhost:21465', 'http://127.0.0.1:21465',
  'http://localhost:5500', 'http://127.0.0.1:5500',
  'http://localhost:8080', 'http://127.0.0.1:8080',
  'http://localhost:3000', 'http://127.0.0.1:3000',
  'http://localhost:5173', 'http://127.0.0.1:5173',
  'http://localhost:4200', 'http://127.0.0.1:4200',
  'https://onedace.onrender.com',
  'null'
];
const envOrigins = String(process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
const allowedOrigins = new Set([...defaultOrigins, ...envOrigins]);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
    if (/^https:\/\/[a-z0-9-]+\.onrender\.com$/.test(origin)) return callback(null, true);
    console.log('[CORS] Allowing origin:', origin);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '25mb' }));

app.use('/whatsapp-service', (req, res) => res.status(404).end());
app.use(express.static(FRONTEND_DIR, { dotfiles: 'deny', index: 'index.html' }));

function handleError(res, error, fallbackMessage, code) {
  let message = error?.message || fallbackMessage;
  
  // Ensure we're not sending HTML error pages
  if (message && (message.includes('<!DOCTYPE') || message.includes('<html'))) {
    message = fallbackMessage || 'Internal server error';
  }
  
  const statusCode = error?.statusCode || 500;
  console.error(`[${code}]`, { message, statusCode, errorMessage: error?.message?.slice(0, 100) });
  res.status(statusCode).json({ success: false, message, code });
}

// ---------- Health ----------

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp-service', wppconnectUrl: WPPCONNECT_URL, wppconnectConfigured: WPPCONNECT_CONFIGURED });
});

app.get('/api/whatsapp/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp', wppconnectUrl: WPPCONNECT_URL, wppconnectConfigured: WPPCONNECT_CONFIGURED });
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

app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    console.log('[WhatsApp Connect] Request started at', new Date().toISOString());
    
    let access;
    try {
      access = await authorizeUser(req);
      console.log('[WhatsApp Connect] User authorized:', access.uid);
    } catch (authErr) {
      console.error('[WhatsApp Connect] Authorization failed:', authErr.message);
      return handleError(res, authErr, 'Unable to authorize user.', 'WHATSAPP_AUTH_ERROR');
    }
    
    const meta = getSessionMeta(access.uid);
    console.log('[WhatsApp Connect] Session meta created:', meta.sessionName);
    
    try {
      console.log('[WhatsApp Connect] Calling ensureClientForUser...');
      await ensureClientForUser(access.uid);
      console.log('[WhatsApp Connect] ensureClientForUser completed, status:', meta.status, 'qr:', !!meta.qr);
      if (!meta.tokenFull) {
        return handleError(res, new Error('WhatsApp upstream is not configured or unreachable.'), 'WhatsApp upstream is not configured or unreachable.', 'WPPCONNECT_UNAVAILABLE');
      }
      if (meta.lastError && !meta.qr) {
        return handleError(res, new Error(meta.lastError), 'Unable to start the WhatsApp session.', 'WPPCONNECT_SESSION_ERROR');
      }
    } catch (ensureErr) {
      console.error('[WhatsApp Connect] ensureClientForUser failed:', ensureErr.message, 'code:', ensureErr.code);
      // Continue even if ensureClient fails - we can still return status
    }
    
    // Fallback: if QR not set yet, try to fetch it directly
    if (!meta.qr && meta.status !== 'isLogged') {
      try {
        console.log('[WhatsApp Connect] Attempting fallback QR code fetch...');
        await refreshQrCode(meta);
      } catch (qrErr) {
        console.log('[WhatsApp Connect] Fallback QR fetch failed:', qrErr.message);
      }
    }
    
    let status;
    try {
      console.log('[WhatsApp Connect] Calling getUserStatus...');
      status = await getUserStatus(access.uid);
      console.log('[WhatsApp Connect] getUserStatus returned:', { status: status.status, connected: status.connected, hasQr: !!status.qr });
    } catch (statusErr) {
      console.error('[WhatsApp Connect] getUserStatus failed:', statusErr.message);
      return handleError(res, statusErr, 'Unable to get WhatsApp status.', 'WHATSAPP_STATUS_ERROR');
    }

    console.log('[WhatsApp Connect] Sending success response...');
    console.log('[WhatsApp Connect] Final meta state:', { status: meta.status, sessionName: meta.sessionName, qrPresent: !!meta.qr, qrLength: meta.qr?.length });
    res.json({
      success: true,
      uid: access.uid,
      sessionName: meta.sessionName,
      qr: meta.qr || null,
      pairingCode: null,
      status: status.status,
      statusText: status.statusText,
      connectionStatus: status.connectionStatus,
      connected: status.connected,
      account: status.account || null,
      diagnostic: {
        metaStatus: meta.status,
        lastError: meta.lastError,
        qrPresent: !!meta.qr
      }
    });
  } catch (error) {
    console.error('[WhatsApp Connect] Fatal error:', error.message, error.stack);
    handleError(res, error, 'Unable to connect WhatsApp.', 'WHATSAPP_CONNECT_ERROR');
  }
});

app.get('/api/whatsapp/qr', async (req, res) => {
  try {
    const access = await authorizeUser(req);
    const meta = getSessionMeta(access.uid);

    if (!meta.tokenFull) {
      return res.json({ success: true, qr: null, pairingCode: null, status: 'Not connected', statusText: 'Not connected', connected: false });
    }

    // Do not restart the session here. This endpoint is polled by the browser;
    // restarting it would invalidate the QR while a phone is scanning it.
    if (!meta.qr) await refreshQrCode(meta);

    const status = await getUserStatus(access.uid);
    res.json({
      success: true,
      qr: meta.qr || null,
      pairingCode: null,
      status: status.status,
      statusText: status.statusText,
      connected: status.connected
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
    const meta = getSessionMeta(access.uid);
    await ensureSessionToken(meta);

    const data = await wppRequest(meta.sessionName, 'get', '/all-chats');
    const chats = Array.isArray(data?.response) ? data.response : [];

    const normalized = chats.map(chat => ({
      ...chat,
      id: normalizeChatId(chat.id) || chat.id,
      isGroup: !!chat.isGroup || isGroupChat(normalizeChatId(chat.id)),
      unreadCount: chat.unreadCount || 0,
      lastMessage: chat.lastMessage || {},
      lastMessagePreview: chat.lastMessagePreview || chat.lastMessage?.body || ''
    }));

    res.json({ success: true, chats: normalized });
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
    await ensureSessionToken(meta);

    let messages = [];
    try {
      const data = await wppRequest(meta.sessionName, 'post', '/all-messages-in-chat', {
        phone: normalizePhone(chatId),
        isGroup: isGroupChat(chatId),
        count: limit
      });
      const raw = Array.isArray(data?.response) ? data.response : [];
      messages = raw.map(normalizeWppMessage).filter(Boolean);
    } catch (e) {
      messages = [];
    }

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
    const meta = getSessionMeta(access.uid);
    await ensureSessionToken(meta);

    const data = await wppRequest(meta.sessionName, 'get', '/all-contacts');
    const contacts = Array.isArray(data?.response) ? data.response : [];
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

    const meta = getSessionMeta(access.uid);
    await ensureSessionToken(meta);

    const data = await wppRequest(meta.sessionName, 'post', '/send-message', {
      phone: normalizePhone(to),
      message: String(text),
      isGroup: isGroupChat(to)
    });

    storeMessage(meta, {
      id: `out_${Date.now()}`,
      chatId: String(to),
      from: 'me',
      to: String(to),
      fromMe: true,
      type: 'chat',
      body: String(text),
      caption: null,
      mimetype: null,
      filename: null,
      isGroupMsg: isGroupChat(to),
      ack: 1,
      timestamp: Date.now(),
      sender: { id: 'me', name: null, pushname: null },
      hasMedia: false
    });

    res.json({ success: true, result: data?.response || data });
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

    const meta = getSessionMeta(access.uid);
    await ensureSessionToken(meta);

    const mediaKind = String(kind || 'file').toLowerCase();
    const name = filename || `file-${Date.now()}`;
    const isImage = mediaKind === 'image' || (mimetype && mimetype.startsWith('image/'));
    let result;

    if (isImage) {
      const data = await wppRequest(meta.sessionName, 'post', '/send-image', {
        phone: normalizePhone(to),
        path: base64,
        caption: caption || '',
        isGroup: isGroupChat(to)
      });
      result = data?.response || data;
    } else {
      const data = await wppRequest(meta.sessionName, 'post', '/send-file-base64', {
        phone: normalizePhone(to),
        base64: base64.replace(/^data:[^;]+;base64,/, ''),
        filename: name,
        caption: caption || '',
        isGroup: isGroupChat(to)
      });
      result = data?.response || data;
    }

    storeMessage(meta, {
      id: `out_${Date.now()}`,
      chatId: String(to),
      from: 'me',
      to: String(to),
      fromMe: true,
      type: isImage ? 'image' : 'document',
      body: caption || '',
      caption: caption || null,
      mimetype: mimetype || null,
      filename: name,
      isGroupMsg: isGroupChat(to),
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
    await ensureSessionToken(meta);

    const data = await wppRequest(meta.sessionName, 'post', '/get-media-by-message-id', {
      messageId
    });

    const base64 = data?.response;
    if (!base64) {
      return res.status(404).json({ success: false, message: 'Media not found for this message.' });
    }

    const dataUrl = base64.startsWith('data:') ? base64 : `data:${req.query.mime || 'application/octet-stream'};base64,${base64}`;
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
      connected: status.connected
    });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp events.', 'WHATSAPP_EVENTS_ERROR');
  }
});

// ---------- Webhook from WPPConnect Server ----------

app.post('/webhook/wppconnect', express.json({ limit: '5mb' }), (req, res) => {
  try {
    const { event, session, data } = req.body || {};

    if (!session || !event) {
      return res.status(400).json({ success: false, message: 'Missing session or event.' });
    }

    const meta = sessions.get(session);
    if (!meta) {
      return res.json({ success: true, ignored: true });
    }

    if (event === 'onMessage' || event === 'onAnyMessage') {
      const normalized = normalizeWppMessage(data);
      if (normalized) {
        storeMessage(meta, normalized);
        meta.updatedAt = new Date().toISOString();
      }
    } else if (event === 'onStateChange') {
      meta.status = String(data?.state || data || meta.status);
      meta.updatedAt = new Date().toISOString();
      if (meta.status === 'isLogged' || meta.status === 'CONNECTED') {
        meta.connectedAt = meta.connectedAt || new Date().toISOString();
        meta.qr = null;
      }
    } else if (event === 'onAck') {
      const ack = data;
      if (ack) {
        const messageId = normalizeChatId(ack.id);
        if (messageId) {
          for (const list of meta.messageStore.values()) {
            const found = list.find(m => m.id === messageId);
            if (found) {
              found.ack = typeof ack.ack === 'number' ? ack.ack : found.ack;
              break;
            }
          }
        }
      }
    } else if (event === 'onDisconnected' || event === 'onLogout') {
      meta.status = 'disconnectedMobile';
      meta.connectedAt = null;
      meta.qr = null;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK_ERROR]', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed.' });
  }
});

// ---------- Global Error Handler ----------

app.use((err, req, res, next) => {
  console.error('[GLOBAL_ERROR_HANDLER]', err);
  const message = (err && err.message) || 'Internal server error';
  const statusCode = (err && err.statusCode) || 500;
  
  // Never send HTML errors
  res.status(statusCode).json({
    success: false,
    message: message,
    code: err?.code || 'INTERNAL_SERVER_ERROR'
  });
});

// ---------- 404 Handler ----------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.path
  });
});

// ---------- Start ----------

app.listen(PORT, () => {
  console.log(`OnePlace WhatsApp proxy listening on http://localhost:${PORT}`);
  console.log(`WPPConnect Server URL: ${WPPCONNECT_URL}`);
});