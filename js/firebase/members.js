(function () {
  if (!window.OP) window.OP = {};

  async function ensureFirebase() {
    if (!window.OP.firebase || !window.OP.firebase.initialized || !window.OP.firebase.db) {
      throw new Error('Firebase Firestore is not initialized.');
    }
    return window.OP.firebase;
  }

  async function ensureUser() {
    const firebase = await ensureFirebase();
    if (!firebase.auth || !firebase.auth.currentUser) {
      throw new Error('User is not authenticated.');
    }
    return firebase.auth.currentUser;
  }

  function resolveDb() {
    const firebase = window.OP && window.OP.firebase ? window.OP.firebase : null;
    const db = (firebase && firebase.db && typeof firebase.db.doc === 'function') ? firebase.db : null;
    if (db) return db;
    if (window.firestore && typeof window.firestore.doc === 'function') return window.firestore;
    if (window.OP && window.OP.firestore && typeof window.OP.firestore.doc === 'function') return window.OP.firestore;
    return null;
  }

  async function getWorkspaceMembers(workspaceId) {
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const snapshot = await db.collection(`workspaces/${workspaceId}/members`).get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  }

  async function addMember(workspaceId, uid, role = 'member') {
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const memberRef = db.doc(`workspaces/${workspaceId}/members/${uid}`);
    const memberRecord = {
      uid,
      role,
      joinedAt: new Date().toISOString(),
      status: 'active'
    };
    await memberRef.set(memberRecord);
    const workspaceRef = firebase.db.doc(`workspaces/${workspaceId}`);
    const workspaceSnap = await workspaceRef.get();
    const workspace = workspaceSnap.exists ? workspaceSnap.data() : {};
    const members = Array.isArray(workspace.members) ? workspace.members : [];
    if (!members.includes(uid)) {
      members.push(uid);
      await workspaceRef.update({ members, updatedAt: new Date().toISOString() });
    }
    return memberRecord;
  }

  async function updateMemberRole(workspaceId, uid, role) {
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const memberRef = db.doc(`workspaces/${workspaceId}/members/${uid}`);
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists) {
      throw new Error('Workspace member not found.');
    }
    await memberRef.update({ role, updatedAt: new Date().toISOString() });
    return { uid, role };
  }

  async function currentUserHasAccess(workspaceId) {
    const user = await ensureUser();
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const memberRef = db.doc(`workspaces/${workspaceId}/members/${user.uid}`);
    const snapshot = await memberRef.get();
    return snapshot.exists;
  }

  window.OP.firebaseMembers = {
    getWorkspaceMembers,
    addMember,
    updateMemberRole,
    currentUserHasAccess
  };
})();
