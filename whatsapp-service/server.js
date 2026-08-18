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

fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const sessions = new Map();

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
      status: 'notLogged',
      qr: null,
      connectedAt: null,
      updatedAt: null,
      lastError: null
    });
  }
  return sessions.get(sessionName);
}

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
    req.body.workspaceId ||
    req.body.activeWorkspaceId ||
    req.headers['x-workspace-id'] ||
    ''
  ).trim();
}

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
    req.body.workspaceAuthToken ||
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

async function readClientAccountInfo(client) {
  const account = { }
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

async function ensureClientForWorkspace(workspaceId) {
  const sessionName = getSessionName(workspaceId);
  const meta = getSessionMeta(workspaceId);

  if (meta.client) {
    return meta.client;
  }

  const client = await wppconnect.create({
    session: sessionName,
    headless: true,
    debug: false,
    logQR: false,
    updatesLog: false,
    autoClose: 0,
    chromeVersion: 'stable',
    tokenStore: 'file',
    folderNameToken: path.join(SESSIONS_DIR, sessionName),
    catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
      const data = base64Qr && base64Qr.startsWith('data:image') ? base64Qr : `data:image/png;base64,${base64Qr || ''}`;
      meta.qr = data;
      meta.status = 'qrReadSuccess';
      meta.updatedAt = new Date().toISOString();
    },
    statusFind: (statusSession, session) => {
      meta.status = String(statusSession || 'notLogged');
      meta.updatedAt = new Date().toISOString();
      if (meta.status === 'isLogged') {
        meta.connectedAt = new Date().toISOString();
      }
      if (meta.status === 'disconnectedMobile' || meta.status === 'deleteToken' || meta.status === 'browserClose') {
        meta.qr = null;
      }
    }
  });

  meta.client = client;
  meta.status = 'notLogged';
  meta.updatedAt = new Date().toISOString();

  client.onMessage(async (message) => {
    if (!message) return;
    meta.lastMessage = message;
  });

  client.onStateChange(async (state) => {
    meta.status = String(state || meta.status || 'notLogged');
    meta.updatedAt = new Date().toISOString();
    if (state === 'isLogged') {
      meta.connectedAt = new Date().toISOString();
    }
  });

  return client;
}

async function getWorkspaceStatus(workspaceId) {
  const meta = getSessionMeta(workspaceId);
  if (!meta.client) {
    return {
      workspaceId,
      sessionName: getSessionName(workspaceId),
      connectionStatus: 'notLogged',
      status: 'Not connected',
      statusText: 'Not connected',
      connected: false,
      qr: null,
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
  meta.status = 'notLogged';
  meta.qr = null;
  meta.connectedAt = null;
  meta.updatedAt = new Date().toISOString();
  meta.lastError = null;

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

const allowedOrigins = new Set([
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
]);

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
app.use(express.json({ limit: '5mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp-service' });
});

app.get('/api/whatsapp/health', (req, res) => {
  res.json({ ok: true, service: 'oneplace-whatsapp' });
});

app.get('/api/whatsapp/status', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const status = await getWorkspaceStatus(access.workspaceId);
    res.json({ success: true, ...status });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unable to load WhatsApp status.';
    res.status(error.statusCode || 401).json({ success: false, message, code: 'WHATSAPP_STATUS_ERROR' });
  }
});

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
    const message = error && error.message ? error.message : 'Unable to authorize workspace.';
    res.status(error.statusCode || 401).json({ success: false, message, code: 'WHATSAPP_WORKSPACE_AUTH_ERROR' });
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
    const client = await ensureClientForWorkspace(access.workspaceId);
    const status = await getWorkspaceStatus(access.workspaceId);

    res.json({
      success: true,
      workspaceId: access.workspaceId,
      sessionName: getSessionName(access.workspaceId),
      qr: status.qr || null,
      status: status.status,
      statusText: status.statusText,
      connectionStatus: status.connectionStatus,
      connected: !!status.connected,
      account: status.account || null
    });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unable to connect WhatsApp.';
    res.status(error.statusCode || 401).json({ success: false, message, code: 'WHATSAPP_CONNECT_ERROR' });
  }
});

app.get('/api/whatsapp/qr', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const status = await getWorkspaceStatus(access.workspaceId);
    res.json({ success: true, qr: status.qr || null, status: status.status, statusText: status.statusText, connected: !!status.connected });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unable to fetch WhatsApp QR.';
    res.status(error.statusCode || 401).json({ success: false, message, code: 'WHATSAPP_QR_ERROR' });
  }
});

app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const result = await disconnectWorkspaceSession(access.workspaceId);
    res.json({ success: true, ...result });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unable to disconnect WhatsApp.';
    res.status(error.statusCode || 401).json({ success: false, message, code: 'WHATSAPP_DISCONNECT_ERROR' });
  }
});

app.get('/api/whatsapp/chats', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const client = await ensureClientForWorkspace(access.workspaceId);
    const chats = typeof client.getAllChats === 'function' ? await client.getAllChats() : [];
    res.json({ success: true, chats });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unable to load WhatsApp chats.';
    res.status(error.statusCode || 401).json({ success: false, message, code: 'WHATSAPP_CHATS_ERROR' });
  }
});

app.post('/api/whatsapp/messages', async (req, res) => {
  try {
    const access = await authorizeWorkspace(req);
    const { to, text } = req.body || {};
    const client = await ensureClientForWorkspace(access.workspaceId);

    if (!to || !text) {
      return res.status(400).json({ success: false, message: 'Recipient and message text are required.' });
    }

    if (typeof client.sendText === 'function') {
      const result = await client.sendText(to, text);
      return res.json({ success: true, result });
    }

    return res.status(400).json({ success: false, message: 'WhatsApp sendText is unavailable in the current session.' });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unable to send WhatsApp message.';
    res.status(error.statusCode || 401).json({ success: false, message, code: 'WHATSAPP_MESSAGE_ERROR' });
  }
});

app.listen(PORT, () => {
  console.log(`OnePlace WhatsApp service listening on http://localhost:${PORT}`);
});
