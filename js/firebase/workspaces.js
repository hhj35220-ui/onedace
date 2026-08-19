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
    if (!window.OP.firebase || !window.OP.firebase.initialized || !window.OP.firebase.db) {
      throw new Error('Firebase Firestore is not initialized.');
    }
    return window.OP.firebase;
  }

  async function ensureAuthedUser() {
    const firebase = await ensureFirebase();
    if (!firebase.auth || !firebase.auth.currentUser) {
      throw new Error('User is not authenticated.');
    }
    return firebase.auth.currentUser;
  }

  function toMemberRecord(uid, role = 'member') {
    return {
      uid,
      role,
      joinedAt: new Date().toISOString(),
      invitedBy: null,
      status: 'active'
    };
  }

  async function listUserWorkspaces(uid) {
    const user = await ensureAuthedUser();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const currentUid = user.uid;
    const snapshot = await db.collection('workspaces').where('members', 'array-contains', currentUid).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async function createWorkspace({ name, slug, size, industry, ownerId, organizationId = null }) {
    const user = await ensureAuthedUser();
    const currentUid = user.uid;
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const safeSlug = String(slug || name || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!safeSlug) {
      return { success: false, message: 'Workspace URL is required.' };
    }

    const workspaceRef = db.doc(`workspaces/${safeSlug}`);
    const existing = await workspaceRef.get();
    if (existing.exists) {
      return { success: false, message: 'This workspace URL is already taken.' };
    }

    const workspaceId = safeSlug;
    const workspace = {
      id: workspaceId,
      name: String(name || '').trim(),
      slug: safeSlug,
      url: safeSlug,
      size: size || '1-10',
      industry: industry || null,
      ownerId: currentUid,
      organizationId: organizationId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [currentUid],
      settings: {
        timezone: 'UTC',
        language: 'en',
        defaultPermission: 'member'
      }
    };

    await workspaceRef.set(workspace);

    const memberRef = db.doc(`workspaces/${workspaceId}/members/${currentUid}`);
    await memberRef.set(toMemberRecord(currentUid, 'owner'));

    const userRef = db.doc(`users/${currentUid}`);
    const userDoc = await userRef.get();
    const activeWorkspaceId = userDoc.exists && userDoc.data()?.activeWorkspaceId ? userDoc.data().activeWorkspaceId : workspaceId;
    await userRef.set({ activeWorkspaceId, updatedAt: new Date().toISOString() }, { merge: true });

    return {
      success: true,
      message: 'Workspace created successfully.',
      workspace: { ...workspace, members: [{ uid: currentUid, role: 'owner' }] }
    };
  }

  async function joinWorkspace({ inviteCode, uid }) {
    const user = await ensureAuthedUser();
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const currentUid = user.uid;

    if (!currentUid) {
      throw new Error('User is not authenticated.');
    }

    const normalizedCode = String(inviteCode || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const workspaceId = normalizedCode.length > 0 ? normalizedCode : null;
    if (!workspaceId) {
      return { success: false, message: 'Invite code is required.' };
    }

    const workspaceRef = db.doc(`workspaces/${workspaceId}`);
    const snapshot = await workspaceRef.get();
    if (!snapshot.exists) {
      return { success: false, message: 'Invalid invite code.' };
    }

    const workspace = { id: snapshot.id, ...snapshot.data() };
    const members = Array.isArray(workspace.members) ? workspace.members : [];
    if (members.includes(currentUid)) {
      return { success: false, message: 'You are already a member of this workspace.' };
    }

    members.push(currentUid);
    await workspaceRef.update({
      members,
      updatedAt: new Date().toISOString()
    });

    const memberRef = db.doc(`workspaces/${workspaceId}/members/${currentUid}`);
    await memberRef.set(toMemberRecord(currentUid, 'member'));

    const userRef = db.doc(`users/${currentUid}`);
    await userRef.set({
      activeWorkspaceId: workspaceId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return {
      success: true,
      message: 'Joined workspace successfully.',
      workspace: { ...workspace, members }
    };
  }

  async function setCurrentWorkspace(workspaceId, uid) {
    const user = await ensureAuthedUser();
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const userId = user.uid;
    if (!userId) {
      throw new Error('User is not authenticated.');
    }
    const memberRef = db.doc(`workspaces/${workspaceId}/members/${userId}`);
    const memberSnapshot = await memberRef.get();
    if (!memberSnapshot.exists) {
      return { success: false, message: 'You are not a member of this workspace.' };
    }

    await db.doc(`users/${userId}`).set({
      activeWorkspaceId: workspaceId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    localStorage.setItem('op_current_workspace', workspaceId);
    return { success: true, workspaceId };
  }

  async function getWorkspace(workspaceId) {
    const firebase = await ensureFirebase();
    const db = resolveDb();
    if (!db) throw new Error('Firestore is not available.');
    const snapshot = await db.doc(`workspaces/${workspaceId}`).get();
    if (!snapshot.exists) {
      return null;
    }
    return { id: snapshot.id, ...snapshot.data() };
  }

  window.OP.firebaseWorkspaces = {
    listUserWorkspaces,
    createWorkspace,
    joinWorkspace,
    setCurrentWorkspace,
    getWorkspace,
    toMemberRecord
  };
})();
