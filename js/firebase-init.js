(function () {
  if (!window.OP) window.OP = {};

  const hasModuleSdk = typeof window.initializeApp === 'function'
    && typeof window.getAuth === 'function'
    && typeof window.GoogleAuthProvider === 'function'
    && typeof window.signInWithPopup === 'function'
    && typeof window.signInWithEmailAndPassword === 'function'
    && typeof window.signOut === 'function';

  if (window.OP.firebase && window.OP.firebase.initialized) {
    window.OP.firebaseReady = () => Promise.resolve(window.OP.firebase);
    return;
  }

  if (hasModuleSdk && !window.OP.firebase) {
    const app = window.initializeApp({
      apiKey: 'AIzaSyAPYya9VUq_suYoQLG8CGM2ppM9TFlKfVQ',
      authDomain: 'oneplace-c3ac8.firebaseapp.com',
      projectId: 'oneplace-c3ac8',
      storageBucket: 'oneplace-c3ac8.firebasestorage.app',
      messagingSenderId: '220251027915',
      appId: '1:220251027915:web:e06e5c3ea9da071d9e1e4e',
      measurementId: 'G-XD2RX55EG9T'
    });
    const auth = window.getAuth(app);

    window.OP.firebase = {
      initialized: true,
      ready: true,
      app,
      auth,
      initError: null,
      signInWithEmailAndPassword: (email, password) => window.signInWithEmailAndPassword(auth, email, password),
      signInWithPopup: (provider) => window.signInWithPopup(auth, provider),
      GoogleAuthProvider: window.GoogleAuthProvider,
      signOut: () => window.signOut(auth)
    };
    window.OP.firebaseReady = () => Promise.resolve(window.OP.firebase);
    return;
  }

  const baseFirebaseState = {
    initialized: false,
    ready: false,
    app: null,
    auth: null,
    initError: null,
    readyPromise: null,
    signInWithEmailAndPassword: null,
    signInWithPopup: null,
    GoogleAuthProvider: null,
    signOut: null
  };

  const currentFirebase = window.OP.firebase || {};
  if (currentFirebase && currentFirebase.initialized && currentFirebase.ready) {
    return;
  }

  const readyPromise = new Promise((resolve, reject) => {
    const finish = (result) => {
      const nextState = {
        ...baseFirebaseState,
        ...currentFirebase,
        ...result,
        ready: !!result.initialized,
        initialized: !!result.initialized
      };

      window.OP.firebase = nextState;
      window.OP.firebaseReady = () => Promise.resolve(nextState);

      if (result.initialized) {
        resolve(nextState);
      } else {
        reject(new Error(result.initError || 'Firebase authentication is not available.'));
      }
    };

    const firebaseConfig = {
      apiKey: "AIzaSyAPYya9VUq_suYoQLG8CGM2ppM9TFlKfVQ",
      authDomain: "oneplace-c3ac8.firebaseapp.com",
      projectId: "oneplace-c3ac8",
      storageBucket: "oneplace-c3ac8.firebasestorage.app",
      messagingSenderId: "220251027915",
      appId: "1:220251027915:web:e06e5c3ea9da071d9e1e4e",
      measurementId: "G-XD2RX55EG9T"
    };

    const hasRequiredSdk = typeof initializeApp === 'function'
      && typeof getAuth === 'function'
      && typeof GoogleAuthProvider === 'function'
      && typeof signInWithPopup === 'function'
      && typeof signInWithEmailAndPassword === 'function'
      && typeof signOut === 'function';

    if (!hasRequiredSdk) {
      const message = 'Firebase SDK is not available. This page must be served over HTTP/HTTPS and the Firebase scripts must load before app.js.';
      console.warn('[Firebase]', message);
      finish({
        initialized: false,
        app: null,
        auth: null,
        initError: message,
        readyPromise: null,
        signInWithEmailAndPassword: null,
        signInWithPopup: null,
        GoogleAuthProvider: null,
        signOut: null
      });
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      const nextState = {
        initialized: true,
        ready: true,
        app,
        auth,
        initError: null,
        readyPromise,
        signInWithEmailAndPassword: (email, password) => signInWithEmailAndPassword(auth, email, password),
        signInWithPopup: (provider) => signInWithPopup(auth, provider),
        GoogleAuthProvider,
        signOut: () => signOut(auth)
      };

      window.OP.firebase = nextState;
      window.OP.firebaseReady = () => Promise.resolve(nextState);
      resolve(nextState);
    } catch (error) {
      const message = error && error.message ? error.message : 'Unable to initialize Firebase Authentication.';
      console.warn('[Firebase]', message, error);
      finish({
        initialized: false,
        app: null,
        auth: null,
        initError: message,
        readyPromise: null,
        signInWithEmailAndPassword: null,
        signInWithPopup: null,
        GoogleAuthProvider: null,
        signOut: null
      });
    }
  });

  window.OP.firebase = {
    ...baseFirebaseState,
    ...(window.OP.firebase || {}),
    readyPromise,
    initError: (window.OP.firebase && window.OP.firebase.initError) || null,
    ready: !!(window.OP.firebase && window.OP.firebase.ready)
  };
  window.OP.firebaseReady = () => readyPromise;
})();
