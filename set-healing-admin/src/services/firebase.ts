// src/services/firebase.ts
// =======================================
// Firebase setup for SET Healing App Admin
// Purpose: Initialize Firebase once and export shared services
// Day 41: Storage upload
// =======================================

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ---------------------------------------
// SECTION A — Firebase config
// Replace these with your Firebase project values
// ---------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ---------------------------------------
// SECTION B — Initialize app
// ---------------------------------------
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ---------------------------------------
// SECTION C — Export services
// ---------------------------------------
export const storage = getStorage(app);
export const db = getFirestore(app);
export { app };

