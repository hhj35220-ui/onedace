import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { config } from './env';

const localServiceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
const localServiceAccountExists = fs.existsSync(localServiceAccountPath);

const normalizePrivateKey = (value: string): string => {
  let key = String(value || '').trim();

  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }

  return key;
};

const hasFirebaseCredentials = Boolean(
  config.FIREBASE_ADMIN_PROJECT_ID &&
  config.FIREBASE_ADMIN_CLIENT_EMAIL &&
  config.FIREBASE_ADMIN_PRIVATE_KEY
);

const credentialOptions = localServiceAccountExists
  ? admin.credential.cert(
      JSON.parse(fs.readFileSync(localServiceAccountPath, 'utf8'))
    )
  : hasFirebaseCredentials
  ? admin.credential.cert({
      projectId: config.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: config.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(config.FIREBASE_ADMIN_PRIVATE_KEY)
    })
  : admin.credential.applicationDefault();

const firebaseApp = admin.apps.length > 0
  ? admin.app()
  : admin.initializeApp({ credential: credentialOptions });

const firebaseAuth: admin.auth.Auth = admin.auth(firebaseApp);
const firebaseAdminInitialized = Boolean(firebaseApp && firebaseAuth);
const firebaseAdminConfigStatus = {
  localServiceAccountExists,
  hasFirebaseCredentials,
  projectId: config.FIREBASE_ADMIN_PROJECT_ID || null,
  clientEmail: config.FIREBASE_ADMIN_CLIENT_EMAIL || null,
  privateKeyConfigured: Boolean(config.FIREBASE_ADMIN_PRIVATE_KEY)
};

export { firebaseAuth, firebaseAdminInitialized, firebaseAdminConfigStatus };
