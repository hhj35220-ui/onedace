/**
 * OnePlace Enterprise — WhatsApp Service (WPPConnect)
 *
 * Express microservice that embeds WPPConnect directly into OnePlace.
 * One WhatsApp session per OnePlace workspace, persisted on disk via
 * WPPConnect's file token store, so sessions survive restarts.
 *
 * Auth model (unchanged from the original service):
 *   1. Caller presents a Firebase ID token (Authorization: Bearer ...).
 *   2. Caller obtains a short-lived workspace-auth token from
 *      POST /api/whatsapp/workspace-auth (verifies Firestore membership).
 *   3. All other endpoints require both the Firebase token and the
 *      workspace-auth token, and are always scoped to one workspaceId.
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
const wppconnect = require('@wppconnect-team/wppconnect');

const app = express();
const PORT = Number(process.env.PORT || 3001);
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const ALLOW_LOCAL_DEV = process.env.ALLOW_LOCAL_DEV === 'true';
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'oneplace-c3ac8';
const FIREBASE_ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
const FIREBASE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const WORKSPACE_AUTH_TTL_SECONDS = Number(process.env.WHATSAPP_WORKSPACE_AUTH_TTL_SECONDS || 600);
const WORKSPACE_AUTH_SECRET = String(process.env.WHATSAPP_WORKSPACE_AUTH_SECRET || crypto.randomBytes(48).toString('hex'));

// In-memory caps (per workspace)
const MAX_MESSAGES_PER_CHAT = Number(process.env.WHATSAPP_MAX_MESSAGES_PER_CHAT || 500);
const MAX_EVENTS_PER_WORKSPACE = Number(process.env.WHATSAPP_MAX_EVENTS || 1000);

fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const sessions = new Map();

// ============================================
// Session registry helpers
// ============================================

function normalizeWorkspaceId(raw) {
  const value = String(raw || '').trim();
  return value || 'default';
}

function getSessionName(workspaceId) {
  const normalized = normalizeWorkspaceId(workspaceId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `oneplace_workspace_${normalized || 'default'}`;
}

function getSessionMeta(workspaceId) {
  const sessionName = getSessionName(workspaceId);
  if (!sessions.has(sessionName)) {
    sessions.set(sessionName, {
      workspaceId,
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

function hasStoredToken(workspaceId) {
  const dir = path.join(SESSIONS_DIR, getSessionName(workspaceId));
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
// Workspace auth tokens (HMAC-signed, short-lived)
// ============================================

function toBase64Url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromBase64Url(input) {
  const padded = String(input || '').replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(String(input || '').length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function signWorkspaceAuthToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', WORKSPACE_AUTH_SECRET)
    .update(message)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${message}.${signature}`;
}

function verifyWorkspaceAuthToken(token) {
  if (!token || typeof token !== 'string') {
    const err = new Error('Missing workspace authorization token.');
    err.statusCode = 403;
    throw err;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    const err = new Error('Workspace authorization token is invalid.');
    err.statusCode = 403;
    throw err;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const message = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac('sha256', WORKSPACE_AUTH_SECRET)
    .update(message)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const received = Buffer.from(encodedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    const err = new Error('Workspace authorization signature is invalid.');
    err.statusCode = 403;
    throw err;
  }

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload));
  } catch (error) {
    const err = new Error('Workspace authorization payload is invalid.');
    err.statusCode = 403;
    throw err;
  }

  if (!payload || !payload.uid || !payload.workspaceId || !payload.exp) {
    const err = new Error('Workspace authorization payload is incomplete.');
    err.statusCode = 403;
    throw err;
  }

  const now = Math.floor(Date.now() / 1000);
  if (Number(payload.exp) <= now) {
    const err = new Error('Workspace authorization token has expired.');
    err.statusCode = 403;
    throw err;
  }

  return payload;
}

function getWorkspaceIdFromRequest(req) {
  return String(
    req.query.workspaceId ||
    req.query.activeWorkspaceId ||
    (req.body && req.body.workspaceId) ||
    (req.body && req.body.activeWorkspaceId) ||
    req.headers['x-workspace-id'] ||
    ''
  ).trim();
}

// ============================================
// Firebase token + workspace membership
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

async function verifyWorkspaceMembership(uid, workspaceId, idToken) {
  const workspaceIdValue = String(workspaceId || '').trim();
  if (!workspaceIdValue) {
    const err = new Error('Workspace ID is required.');
    err.statusCode = 400;
    throw err;
  }

  if (!idToken && !ALLOW_LOCAL_DEV) {
    const err = new Error('Missing Firebase token for workspace membership verification.');
    err.statusCode = 401;
    throw err;
  }

  if (ALLOW_LOCAL_DEV && !idToken) {
    return true;
  }

  const encodedWorkspace = encodeURIComponent(workspaceIdValue);
  const encodedUid = encodeURIComponent(uid);
  const memberDocUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/workspaces/${encodedWorkspace}/members/${encodedUid}`;
  const response = await fetch(memberDocUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
      Accept: 'application/json'
    }
  });

  if (response.status === 403 || response.status === 404) {
    const err = new Error('User is not authorized for this workspace.');
    err.statusCode = 403;
    throw err;
  }

  if (!response.ok) {
    const err = new Error('Workspace membership verification failed.');
    err.statusCode = 502;
    throw err;
  }

  const memberDoc = await response.json().catch(() => null);
  if (!memberDoc || !memberDoc.name) {
    const err = new Error('Workspace membership record is invalid.');
    err.statusCode = 403;
    throw err;
  }

  const expectedSuffix = `/workspaces/${workspaceIdValue}/members/${uid}`;
  if (!String(memberDoc.name).endsWith(expectedSuffix)) {
    const err = new Error('Workspace membership record does not match authenticated user.');
    err.statusCode = 403;
    throw err;
  }

  return true;
}

async function createWorkspaceAuthorization(req) {
  const workspaceId = getWorkspaceIdFromRequest(req);
  if (!workspaceId) {
    const err = new Error('workspaceId is required.');
    err.statusCode = 400;
    throw err;
  }

  const identity = await verifyFirebaseToken(req);
  await verifyWorkspaceMembership(identity.uid, workspaceId, identity.token);

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    uid: identity.uid,
    workspaceId,
    email: identity.email || null,
    iat: now,
    exp: now + WORKSPACE_AUTH_TTL_SECONDS
  };

  const token = signWorkspaceAuthToken(payload);
  return {
    workspaceId,
    token,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    expiresInSeconds: WORKSPACE_AUTH_TTL_SECONDS
  };
}

async function authorizeWorkspace(req) {
  const workspaceId = getWorkspaceIdFromRequest(req);

  if (!workspaceId) {
    const err = new Error('workspaceId is required.');
    err.statusCode = 400;
    throw err;
  }

  const identity = await verifyFirebaseToken(req);
  const workspaceAuthToken = String(
    req.headers['x-workspace-auth'] ||
    req.headers['x-workspace-token'] ||
    req.query.workspaceAuthToken ||
    (req.body && req.body.workspaceAuthToken) ||
    ''
  ).trim();

  const workspaceClaims = verifyWorkspaceAuthToken(workspaceAuthToken);
  if (workspaceClaims.uid !== identity.uid) {
    const err = new Error('Workspace authorization user mismatch.');
    err.statusCode = 403;
    throw err;
  }

  if (workspaceClaims.workspaceId !== workspaceId) {
    const err = new Error('Workspace authorization workspace mismatch.');
    err.statusCode = 403;
    throw err;
  }

  return {
    uid: identity.uid,
    workspaceId,
    email: identity.email || null,
    workspaceClaims
  };
}

// ============================================
// Message normalization + per-workspace store
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
  const client = await wppconnect.create({
    session: meta.sessionName,
    headless: true,
    debug: false,
    logQR: false,
    updatesLog: false,
    autoClose: 0,
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
async function ensureClientForWorkspace(workspaceId, options = {}) {
  const meta = getSessionMeta(workspaceId);

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

async function getWorkspaceStatus(workspaceId) {
  const meta = getSessionMeta(workspaceId);

  // Auto-resume a persisted session in the background so a plain status
  // poll reconnects WhatsApp after a service restart.
  if (!meta.client && !meta.creating && hasStoredToken(workspaceId)) {
    ensureClientForWorkspace(workspaceId).catch(() => {});
  }

  if (!meta.client) {
    return {
      workspaceId,
      sessionName: getSessionName(workspaceId),
      connectionStatus: meta.creating ? 'initializing' : 'notLogged',
      status: meta.creating ? 'Connecting' : 'Not connected',
      statusText: meta.creating ? 'Connecting' : 'Not connected',
      connected: false,
      qr: meta.qr || null,
      pairingCode: meta.pairingCode || null,
      hasStoredSession: hasStoredToken(workspaceId),
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
      workspaceId,
      sessionName: getSessionName(workspaceId),
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
      workspaceId,
      sessionName: getSessionName(workspaceId),
      connectionStatus: meta.status || 'notLogged',
      status: mapStatus(meta.status || 'notLogged'),
      statusText: uiStatusFromState(meta.status || 'notLogged'),
      connected: false,
      qr: meta.qr || null,
      pairingCode: meta.pairingCode || null,
      hasStoredSession: hasStoredToken(workspaceId),
      lastUpdatedAt: meta.updatedAt,
      connectedAt: meta.connectedAt,
      error: meta.lastError,
      account: null
    };
  }
}

async function disconnectWorkspaceSession(workspaceId) {
  const meta = getSessionMeta(workspaceId);
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

  const proprietaryTokenDir = path.join(SESSIONS_DIR, getSessionName(workspaceId));
  if (fs.existsSync(proprietaryTokenDir)) {
    try {
      fs.rmSync(proprietaryTokenDir, { recursive: true, force: true });
    } catch (error) {}
  }

  return {
    workspaceId,
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-Auth', 'X-Workspace-Token', 'X-Workspace-Id', 'X-User-Id']
}));
// 25mb to carry base64 media payloads
app.use(express.json({ limit: '25mb' }));

function handleError(res, error, fallbackMessage, code) {
  const message = error && error.message ? error.message : fallbackMessage;
  res.status(error.statusCode || 500).json({ success: false, message, code });
}

// ---------- Health ----------

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp-service' });
});

app.get('/api/whatsapp/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp' });
});

// ---------- Auth ----------

app.post('/api/whatsapp/workspace-auth', async (req, res) => {
  try {
    const auth = await createWorkspaceAuthorization(req);
    res.json({
      success: true,
      workspaceId: auth.workspaceId,
      workspaceAuthToken: auth.token,
      workspaceAuthExpiresAt: auth.expiresAt,
      expiresInSeconds: auth.expiresInSeconds
    });
  } catch (error) {
    handleError(res, error, 'Unable to authorize workspace.', 'WHATSAPP_WORKSPACE_AUTH_ERROR');
  }
});

// ---------- Status / connection ----------

app.get('/api/whatsapp/status', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const status = await getWorkspaceStatus(access.workspaceId);
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
    const access = await authorizeWorkspace(req);
    const phoneNumber = req.body && req.body.phoneNumber ? String(req.body.phoneNumber) : null;
    await ensureClientForWorkspace(access.workspaceId, phoneNumber ? { phoneNumber } : {});
    const status = await getWorkspaceStatus(access.workspaceId);

    res.json({
      success: true,
      workspaceId: access.workspaceId,
      sessionName: getSessionName(access.workspaceId),
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
    const access = await authorizeWorkspace(req);
    const status = await getWorkspaceStatus(access.workspaceId);
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
    const access = await authorizeWorkspace(req);
    const result = await disconnectWorkspaceSession(access.workspaceId);
    res.json({ success: true, ...result });
  } catch (error) {
    handleError(res, error, 'Unable to disconnect WhatsApp.', 'WHATSAPP_DISCONNECT_ERROR');
  }
});

// ---------- Chats / contacts ----------

app.get('/api/whatsapp/chats', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const client = await ensureClientForWorkspace(access.workspaceId);
    const chats = typeof client.getAllChats === 'function' ? await client.getAllChats() : [];
    res.json({ success: true, chats });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp chats.', 'WHATSAPP_CHATS_ERROR');
  }
});

app.get('/api/whatsapp/chats/:chatId/messages', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const chatId = decodeURIComponent(req.params.chatId);
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 200));
    const meta = getSessionMeta(access.workspaceId);

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
    const access = await authorizeWorkspace(req);
    const client = await ensureClientForWorkspace(access.workspaceId);
    const contacts = typeof client.getAllContacts === 'function' ? await client.getAllContacts() : [];
    res.json({ success: true, contacts });
  } catch (error) {
    handleError(res, error, 'Unable to load WhatsApp contacts.', 'WHATSAPP_CONTACTS_ERROR');
  }
});

// ---------- Sending ----------

app.post('/api/whatsapp/messages', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const { to, text } = req.body || {};

    if (!to || !text) {
      return res.status(400).json({ success: false, message: 'Recipient and message text are required.' });
    }

    const client = await ensureClientForWorkspace(access.workspaceId);

    if (typeof client.sendText !== 'function') {
      return res.status(400).json({ success: false, message: 'WhatsApp sendText is unavailable in the current session.' });
    }

    const result = await client.sendText(to, text);

    // Record the outgoing message so every workspace member sees it
    const meta = getSessionMeta(access.workspaceId);
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
    const access = await authorizeWorkspace(req);
    const { to, base64, filename, mimetype, caption, kind } = req.body || {};

    if (!to || !base64) {
      return res.status(400).json({ success: false, message: 'Recipient (to) and base64 media are required.' });
    }

    const client = await ensureClientForWorkspace(access.workspaceId);
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

    const meta = getSessionMeta(access.workspaceId);
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
    const access = await authorizeWorkspace(req);
    const messageId = decodeURIComponent(req.params.messageId);
    const meta = getSessionMeta(access.workspaceId);

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
    const access = await authorizeWorkspace(req);
    const meta = getSessionMeta(access.workspaceId);
    const since = Math.max(0, Number(req.query.since) || 0);
    const events = meta.events.filter(e => e.seq > since);
    const status = await getWorkspaceStatus(access.workspaceId);

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