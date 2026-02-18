// lib/firebase.ts
// =======================================
// SECTION A — Firebase bootstrap (single source of truth)
// Purpose: Initialize Firebase once and export shared instances.
// Next files (tracks/auth) will import from here.
// =======================================

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// =======================================
// SECTION B — Firebase config
// IMPORTANT: Replace these placeholders with your Firebase project config.
// You’ll get this from Firebase Console → Project Settings → Web App config.
// =======================================
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// =======================================
// SECTION C — Initialize Firebase only once
// Why: Expo reloads can re-run files; this prevents duplicate init.
// =======================================
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// =======================================
// SECTION D — Export Firebase services
// These are imported elsewhere (auth, tracks, uploads).
// =======================================
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);