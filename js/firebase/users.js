(function () {
  if (!window.OP) window.OP = {};

  function resolveDb() {
    const firebase = window.OP && window.OP.firebase ? window.OP.firebase : null;
    const db = (firebase && firebase.db && typeof firebase.db.doc === 'function') ? firebase.db : null;
    if (db) return db;
    if (window.firestore && typeof window.firestore.doc === 'function') return window.firestore;
    if (window.OP && window.OP.firestore && typeof window.OP.firestore.doc === 'function') return window.OP.firestore;
    return null;
  }

  async function ensureFirebase() {
    if (!window.OP.firebase || !window.OP.firebase.initialized || !window.OP.firebase.auth) {
      throw new Error('Firebase authentication is not initialized.');
    }
    return window.OP.firebase;
  }

  async function ensureUser() {
    const firebase = await ensureFirebase();
    const user = firebase.auth && firebase.auth.currentUser ? firebase.auth.currentUser : null;
    if (!user) {
      throw new Error('User is not authenticated.');
    }
    return user;
  }

  async function buildUserRecord(user, extra = {}) {
    const currentUser = user || (await ensureUser());
    const email = String(currentUser.email || extra.email || '').trim().toLowerCase();
    const displayName = String(currentUser.displayName || extra.displayName || '').trim();
    const nameParts = displayName ? displayName.split(/\s+/).filter(Boolean) : [];
    const firstName = String(extra.firstName || nameParts[0] || '').trim();
    const lastName = String(extra.lastName || nameParts.slice(1).join(' ') || '').trim();
    const profile = {
      uid: currentUser.uid,
      email,
      displayName: displayName || email || 'User',
      photoURL: currentUser.photoURL || extra.photoURL || null,
      createdAt: extra.createdAt || currentUser.metadata?.creationTime || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingCompleted: Boolean(extra.onboardingCompleted),
      firstName,
      lastName,
      role: extra.role || 'member',
      emailVerified: !!currentUser.emailVerified,
      ...extra
    };

    return profile;
  }

  async function ensureUserDoc() {
    const firebase = await ensureFirebase();
    const user = await ensureUser();
    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore is not available.');
    }
    if (window.OP.firebase) window.OP.firebase.db = db;

    const userRef = db.doc(`users/${user.uid}`);
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      const profile = await buildUserRecord(user, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || null,
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await userRef.set(profile);
      return profile;
    }

    return { uid: user.uid, ...docSnap.data() };
  }

  async function getCurrentProfile() {
    const firebase = await ensureFirebase();
    const user = firebase.auth && firebase.auth.currentUser ? firebase.auth.currentUser : null;
    if (!user) {
      return null;
    }
    const db = resolveDb();
    if (!db) {
      return null;
    }
    const userRef = db.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      const profile = await buildUserRecord(user, { onboardingCompleted: false, createdAt: new Date().toISOString() });
      await userRef.set(profile);
      return profile;
    }
    return { uid: user.uid, ...snapshot.data() };
  }

  async function updateCurrentProfile(updates) {
    const firebase = await ensureFirebase();
    const user = firebase.auth && firebase.auth.currentUser ? firebase.auth.currentUser : null;
    if (!user) {
      throw new Error('User is not authenticated.');
    }

    const db = resolveDb();
    if (!db) {
      throw new Error('Firestore is not available.');
    }
    if (window.OP.firebase) window.OP.firebase.db = db;

    const currentProfile = await getCurrentProfile();
    const merged = await buildUserRecord(user, {
      ...(currentProfile || {}),
      ...(updates || {}),
      uid: user.uid,
      email: String((updates && updates.email) || user.email || '').trim().toLowerCase() || currentProfile?.email || user.email || '',
      displayName: String((updates && updates.displayName) || currentProfile?.displayName || user.displayName || '').trim() || (user.email || 'User'),
      updatedAt: new Date().toISOString(),
      onboardingCompleted: updates?.onboardingCompleted ?? currentProfile?.onboardingCompleted ?? false,
      photoURL: updates?.photoURL || updates?.avatarUrl || currentProfile?.photoURL || user.photoURL || null
    });

    const userRef = db.doc(`users/${user.uid}`);
    await userRef.set(merged, { merge: true });
    return merged;
  }

  window.OP.firebaseUsers = {
    ensureUserDoc,
    getCurrentProfile,
    updateCurrentProfile,
    buildUserRecord
  };
})();
