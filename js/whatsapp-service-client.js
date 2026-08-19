/* OnePlace Enterprise — WhatsApp Service Client
   Thin browser client for the OnePlace WhatsApp service (whatsapp-service/),
   which embeds WPPConnect. Exposed as window.OP.whatsappService.

   Auth flow per request:
     1. Firebase ID token  -> Authorization: Bearer <idToken>
     2. Workspace-auth token (HMAC, short-lived) obtained once per workspace
        from POST /api/whatsapp/workspace-auth and cached until expiry.
     3. workspaceId is resolved from the active OnePlace workspace.

   Local development without Firebase: run the service with
   ALLOW_LOCAL_DEV=true and set localStorage 'op_wa_dev_user' to any uid;
   the client then sends X-User-Id instead of a Bearer token.
*/
(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.whatsappService) return;

  const DEFAULT_BASE_URL = 'http://localhost:3001';
  const DEV_USER_KEY = 'op_wa_dev_user';

  // workspaceId -> { token, expiresAt }
  const workspaceAuthCache = new Map();

  function getBaseUrl() {
    const configured = window.OP_CONFIG && window.OP_CONFIG.whatsappServiceUrl;
    return String(configured || DEFAULT_BASE_URL).replace(/\/+$/, '');
  }

  function getWorkspaceId() {
    const workspace = window.OP.workspace && typeof window.OP.workspace.getCurrentWorkspace === 'function'
      ? window.OP.workspace.getCurrentWorkspace()
      : null;
    return (workspace && workspace.id) || '';
  }

  async function resolveWorkspaceId() {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace is selected. Please select a workspace and try again.');
    }

    if (window.OP && window.OP.firebaseWorkspaces && typeof window.OP.firebaseWorkspaces.getWorkspace === 'function') {
      const firestoreWorkspace = await window.OP.firebaseWorkspaces.getWorkspace(workspaceId);
      if (!firestoreWorkspace || !firestoreWorkspace.id) {
        throw new Error('Selected workspace is not Firestore-backed. Create or join a workspace in Firebase before using WhatsApp.');
      }
    }

    return workspaceId;
  }

  function getDevUser() {
    try {
      return window.localStorage.getItem(DEV_USER_KEY);
    } catch (e) {
      return null;
    }
  }

  function waitForAuthUser(auth, timeoutMs = 4000) {
    return new Promise(resolve => {
      if (auth.currentUser) return resolve(auth.currentUser);
      if (typeof auth.onAuthStateChanged !== 'function') return resolve(null);
      let settled = false;
      const finish = user => {
        if (settled) return;
        settled = true;
        try { unsubscribe(); } catch (e) {}
        resolve(user || auth.currentUser || null);
      };
      const unsubscribe = auth.onAuthStateChanged(user => finish(user));
      setTimeout(() => finish(null), timeoutMs);
    });
  }

  async function getIdToken() {
    // Preferred path: live Firebase Auth session (SDK loaded on the page).
    try {
      if (typeof window.OP.firebaseReady === 'function') {
        const firebase = await window.OP.firebaseReady();
        if (firebase && firebase.auth) {
          const user = await waitForAuthUser(firebase.auth);
          if (user && typeof user.getIdToken === 'function') {
            return await user.getIdToken();
          }
        }
      }
    } catch (e) {
      // fall through to stored tokens
    }

    // Fallback: token persisted by the auth flow, if any.
    const session = window.OP.auth && typeof window.OP.auth.getSession === 'function'
      ? window.OP.auth.getSession()
      : null;
    return (session && (session.idToken || (session.user && session.user.idToken))) || null;
  }

  async function buildAuthHeaders(workspaceId) {
    const headers = { 'X-Workspace-Id': workspaceId };
    const idToken = await getIdToken();
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    } else if (getDevUser()) {
      headers['X-User-Id'] = getDevUser();
    }
    return headers;
  }

  async function getWorkspaceAuthToken(workspaceId) {
    const cached = workspaceAuthCache.get(workspaceId);
    if (cached && cached.expiresAt > Date.now() + 15000) {
      return cached.token;
    }

    const headers = await buildAuthHeaders(workspaceId);
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${getBaseUrl()}/api/whatsapp/workspace-auth`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ workspaceId })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload || !payload.success) {
      throw new Error((payload && payload.message) || 'Unable to authorize workspace for WhatsApp.');
    }

    workspaceAuthCache.set(workspaceId, {
      token: payload.workspaceAuthToken,
      expiresAt: Date.parse(payload.workspaceAuthExpiresAt) || (Date.now() + 590000)
    });
    return payload.workspaceAuthToken;
  }

  async function request(path, options = {}) {
    const workspaceId = options.workspaceId || await resolveWorkspaceId();
    const workspaceAuth = await getWorkspaceAuthToken(workspaceId);
    const headers = await buildAuthHeaders(workspaceId);
    headers['X-Workspace-Auth'] = workspaceAuth;

    let body;
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.body);
    }

    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: options.method || 'GET',
      headers,
      body
    });

    const payload = await response.json().catch(() => null);

    // Workspace-auth tokens are short-lived: refresh once on 403 and retry.
    if (response.status === 403 && !options._retried) {
      workspaceAuthCache.delete(workspaceId);
      return request(path, Object.assign({}, options, { _retried: true }));
    }

    if (!response.ok || !payload || payload.success === false) {
      const error = new Error((payload && payload.message) || `WhatsApp service request failed (${response.status}).`);
      error.status = response.status;
      error.code = payload && payload.code;
      throw error;
    }

    return payload;
  }

  function qs(params) {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') search.set(key, value);
    });
    const str = search.toString();
    return str ? `?${str}` : '';
  }

  window.OP.whatsappService = {
    getBaseUrl,
    getWorkspaceId,

    status() {
      return request('/api/whatsapp/status');
    },

    connect(options = {}) {
      return request('/api/whatsapp/connect', {
        method: 'POST',
        body: options.phoneNumber ? { phoneNumber: options.phoneNumber } : {}
      });
    },

    qr() {
      return request('/api/whatsapp/qr');
    },

    disconnect() {
      return request('/api/whatsapp/disconnect', { method: 'POST', body: {} });
    },

    chats() {
      return request('/api/whatsapp/chats');
    },

    chatMessages(chatId, limit = 50) {
      return request(`/api/whatsapp/chats/${encodeURIComponent(chatId)}/messages${qs({ limit })}`);
    },

    contacts() {
      return request('/api/whatsapp/contacts');
    },

    sendText(to, text) {
      return request('/api/whatsapp/messages', { method: 'POST', body: { to, text } });
    },

    /**
     * Send media as base64.
     * kind: 'image' | 'ptt' (voice) | 'file' (document/video/anything)
     */
    sendMedia(to, media) {
      return request('/api/whatsapp/messages/media', {
        method: 'POST',
        body: {
          to,
          base64: media.base64,
          filename: media.filename,
          mimetype: media.mimetype,
          caption: media.caption || '',
          kind: media.kind || 'file'
        }
      });
    },

    downloadMedia(messageId) {
      return request(`/api/whatsapp/media/${encodeURIComponent(messageId)}`);
    },

    /** Poll new events (incoming/outgoing messages) after a sequence number. */
    events(since = 0) {
      return request(`/api/whatsapp/events${qs({ since })}`);
    },

    /** Read a File into a base64 data payload ready for sendMedia(). */
    fileToMedia(file, kind) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Unable to read the selected file.'));
        reader.onload = () => {
          resolve({
            base64: String(reader.result || ''),
            filename: file.name,
            mimetype: file.type || 'application/octet-stream',
            kind: kind || (file.type && file.type.startsWith('image/') ? 'image' : 'file')
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };
})();