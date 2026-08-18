(function () {
  if (!window.OP) window.OP = {};

  const firebaseConfig = {
    apiKey: 'AIzaSyAPYya9VUq_suYoQLG8CGM2ppM9TFlKfVQ',
    authDomain: 'oneplace-c3ac8.firebaseapp.com',
    projectId: 'oneplace-c3ac8',
    storageBucket: 'oneplace-c3ac8.firebasestorage.app',
    messagingSenderId: '220251027915',
    appId: '1:220251027915:web:e06e5c3ea9da071d9e1e4e',
    measurementId: 'G-XD2RX55EG9T'
  };

  const baseState = {
    initialized: false,
    ready: false,
    app: null,
    auth: null,
    db: null,
    storage: null,
    messaging: null,
    initError: null,
    readyPromise: null,
    signInWithEmailAndPassword: null,
    signInWithPopup: null,
    GoogleAuthProvider: null,
    signOut: null
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve();
          return;
        }
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  async function initializeFirebase() {
    if (window.OP.firebase && window.OP.firebase.initialized) {
      return window.OP.firebase;
    }

    const firebaseVersion = '10.11.0';
    const baseUrl = `https://www.gstatic.com/firebasejs/${firebaseVersion}`;

    try {
      await loadScript(`${baseUrl}/firebase-app-compat.js`);
      await loadScript(`${baseUrl}/firebase-auth-compat.js`);
      await loadScript(`${baseUrl}/firebase-firestore-compat.js`);
      await loadScript(`${baseUrl}/firebase-storage-compat.js`);
      if (typeof window.firebase?.messaging === 'function') {
        await loadScript(`${baseUrl}/firebase-messaging-compat.js`);
      }
    } catch (error) {
      console.warn('[Firebase] SDK load failed', error);
      throw error;
    }

    const firebaseLib = window.firebase;
    if (!firebaseLib || typeof firebaseLib.initializeApp !== 'function' || typeof firebaseLib.auth !== 'function') {
      throw new Error('Firebase Web SDK is unavailable.');
    }

    const app = firebaseLib.apps?.length ? firebaseLib.apps[0] : firebaseLib.initializeApp(firebaseConfig);
    const auth = firebaseLib.auth();
    const db = typeof firebaseLib.firestore === 'function' ? firebaseLib.firestore() : null;
    const storage = typeof firebaseLib.storage === 'function' ? firebaseLib.storage() : null;
    const messaging = typeof firebaseLib.messaging === 'function' ? firebaseLib.messaging() : null;

    const validDb = db && typeof db === 'object' && typeof db.doc === 'function' && typeof db.collection === 'function' ? db : null;
    const safeDb = validDb || (window.OP && window.OP.firebase && window.OP.firebase.db && typeof window.OP.firebase.db.doc === 'function' ? window.OP.firebase.db : null) || (window.firestore && typeof window.firestore.doc === 'function' ? window.firestore : null);

    if (safeDb) {
      window.firestore = safeDb;
      window.OP.firestore = safeDb;
      if (window.OP.firebase) window.OP.firebase.db = safeDb;
      if (window.firebase && typeof window.firebase.firestore === 'function') {
        window.firebase.firestore = () => safeDb;
      }
    }
    if (!window.getAuth || typeof window.getAuth !== 'function') {
      window.getAuth = firebaseLib.auth;
    }
    if (!window.initializeApp || typeof window.initializeApp !== 'function') {
      window.initializeApp = firebaseLib.initializeApp;
    }
    if (!window.GoogleAuthProvider || typeof window.GoogleAuthProvider !== 'function') {
      window.GoogleAuthProvider = firebaseLib.auth.GoogleAuthProvider;
    }
    if (!window.signInWithEmailAndPassword || typeof window.signInWithEmailAndPassword !== 'function') {
      window.signInWithEmailAndPassword = (authInstance, email, password) => authInstance.signInWithEmailAndPassword(email, password);
    }
    if (!window.signInWithPopup || typeof window.signInWithPopup !== 'function') {
      window.signInWithPopup = (authInstance, provider) => authInstance.signInWithPopup(provider);
    }
    if (!window.signOut || typeof window.signOut !== 'function') {
      window.signOut = (authInstance) => authInstance.signOut();
    }

    const state = {
      ...baseState,
      initialized: true,
      ready: true,
      app,
      auth,
      db,
      storage,
      messaging,
      initError: null,
      readyPromise: Promise.resolve(),
      signInWithEmailAndPassword: (email, password) => auth.signInWithEmailAndPassword(email, password),
      signInWithPopup: (provider) => auth.signInWithPopup(provider),
      GoogleAuthProvider: firebaseLib.auth.GoogleAuthProvider,
      signOut: () => auth.signOut()
    };

    window.OP.firebase = state;
    window.OP.firestore = db;
    window.OP.firebaseReady = () => Promise.resolve(state);
    window.firestore = db;
    return state;
  }

  window.OP.firebaseReady = async function () {
    if (window.OP.firebase && window.OP.firebase.initialized) {
      return window.OP.firebase;
    }
    return initializeFirebase();
  };

  initializeFirebase().catch((error) => {
    window.OP.firebase = {
      ...baseState,
      initialized: false,
      ready: false,
      initError: error && error.message ? error.message : 'Firebase initialization failed.'
    };
    console.warn('[Firebase]', window.OP.firebase.initError, error);
  });
})();
