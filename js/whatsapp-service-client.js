/* OnePlace Enterprise — WhatsApp Service Client */
(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.whatsappService) return;

  const DEFAULT_BASE_URL = 'http://localhost:3001';
  const DEV_USER_KEY = 'op_wa_dev_user';

  function getBaseUrl() {
    const configured = window.OP_CONFIG && window.OP_CONFIG.whatsappServiceUrl;
    return String(configured || DEFAULT_BASE_URL).replace(/\/+$/, '');
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
    } catch (e) {}

    const session = window.OP.auth && typeof window.OP.auth.getSession === 'function'
      ? window.OP.auth.getSession()
      : null;
    return (session && (session.idToken || (session.user && session.user.idToken))) || null;
  }

  async function buildAuthHeaders() {
    const headers = {};
    const idToken = await getIdToken();
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    } else if (getDevUser()) {
      headers['X-User-Id'] = getDevUser();
    }
    return headers;
  }

  async function request(path, options = {}) {
    const headers = await buildAuthHeaders();
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

    events(since = 0) {
      return request(`/api/whatsapp/events${qs({ since })}`);
    },

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
