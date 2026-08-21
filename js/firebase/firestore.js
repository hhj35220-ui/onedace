(function () {
  if (!window.OP) window.OP = {};
  if (window.OP.firestoreDataLayer) return;

  function ensureFirebase() {
    if (!window.OP.firebase || !window.OP.firebase.initialized) {
      throw new Error('Firebase is not initialized.');
    }
    return window.OP.firebase;
  }

  function firestoreApi() {
    const firebase = ensureFirebase();
    if (firebase.db && typeof firebase.db.doc === 'function') {
      return firebase.db;
    }
    if (window.firebase && typeof window.firebase.firestore === 'function') {
      return window.firebase.firestore();
    }
    throw new Error('Firestore SDK is not available.');
  }

  function ensureUser() {
    const session = window.OP && window.OP.auth && typeof window.OP.auth.getSession === 'function'
      ? window.OP.auth.getSession()
      : null;
    if (!session || !session.userId) {
      throw new Error('User is not authenticated.');
    }
    return session;
  }

  function getCollectionPath(collectionName) {
    return `${collectionName}`;
  }

  function docRef(collectionName, docId) {
    const db = ensureFirebase().db || null;
    if (!db) {
      throw new Error('Firestore is not available.');
    }
    return db.doc(`${getCollectionPath(collectionName)}/${docId}`);
  }

  function collectionRef(collectionName) {
    const db = ensureFirebase().db || null;
    if (!db) {
      throw new Error('Firestore is not available.');
    }
    return db.collection(getCollectionPath(collectionName));
  }

  const dataLayer = {
    ensureFirebase,
    ensureUser,
    collectionRef,
    docRef,
    async getDocument(collectionName, docId) {
      try {
        const ref = docRef(collectionName, docId);
        const snapshot = await ref.get();
        return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
      } catch (error) {
        console.warn('[FirebaseDataLayer]', 'getDocument failed', collectionName, docId, error);
        return null;
      }
    },
    async listCollection(collectionName, queryFn) {
      try {
        let ref = collectionRef(collectionName);
        if (queryFn && typeof queryFn === 'function') {
          ref = queryFn(ref);
        }
        const snapshot = await ref.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.warn('[FirebaseDataLayer]', 'listCollection failed', collectionName, error);
        return [];
      }
    },
    async setDocument(collectionName, docId, data) {
      const ref = docRef(collectionName, docId);
      await ref.set({ ...data, updatedAt: new Date().toISOString() });
      return { id: docId, ...data };
    },
    async updateDocument(collectionName, docId, data) {
      const ref = docRef(collectionName, docId);
      await ref.update({ ...data, updatedAt: new Date().toISOString() });
      return { id: docId, ...data };
    },
    async deleteDocument(collectionName, docId) {
      const ref = docRef(collectionName, docId);
      await ref.delete();
      return true;
    }
  };

  window.OP.firestoreDataLayer = dataLayer;
})();
