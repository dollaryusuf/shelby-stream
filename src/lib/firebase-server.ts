import admin from 'firebase-admin';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');

let firebaseConfig: any = {};

if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = require(configPath);
  } catch (error) {
    console.error('Error loading firebase-applet-config.json:', error);
  }
} else {
  console.warn('firebase-applet-config.json not found at', configPath);
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    if (firebaseConfig.projectId) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
      console.log('Firebase Admin initialized with project ID:', firebaseConfig.projectId);
    } else {
      admin.initializeApp();
      console.log('Firebase Admin initialized with default credentials');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export const db = admin.firestore();

if (firebaseConfig.firestoreDatabaseId) {
  try {
    // If a specific database ID is provided, use it
    db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
    console.log('Firestore using database ID:', firebaseConfig.firestoreDatabaseId);
  } catch (error) {
    console.error('Error setting Firestore database ID:', error);
  }
}

export const auth = admin.auth();
