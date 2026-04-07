import admin from 'firebase-admin';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

export const db = admin.firestore();
if (firebaseConfig.firestoreDatabaseId) {
  // If a specific database ID is provided, use it
  // Note: firebase-admin v11.x+ supports this via settings
  db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
}

export const auth = admin.auth();
