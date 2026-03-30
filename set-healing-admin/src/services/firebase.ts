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
  apiKey: "AIzaSyCN5Nw8f7h-rVax9r8VbSrYXASLfMUKWo4",
  authDomain: "set-healing-app.firebaseapp.com",
  projectId: "set-healing-app",
  storageBucket: "set-healing-app.firebasestorage.app",
  messagingSenderId: "825181514214",
  appId: "1:825181514214:web:a0737d1cba2296bb344e27",
  measurementId: "G-7TDSWQLLZD"
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

