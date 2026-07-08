// =======================================
// lib/firebase.ts
// Day 57 — Performance & reliability fixes
// =======================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/* ---------------------------------------
   SECTION A — Config
   Values come from .env via EXPO_PUBLIC_ prefix
---------------------------------------- */
const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/* ---------------------------------------
   SECTION B — Initialize app once
   Guards against Expo hot-reload re-init
---------------------------------------- */
export const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

/* ---------------------------------------
   SECTION C — Auth with AsyncStorage persistence
---------------------------------------- */
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/* ---------------------------------------
   SECTION D — Firestore with local cache
   Day 57: persistentLocalCache means tracks
   load instantly on repeat visits even
   without a network connection.
   Falls back gracefully if already initialized.
---------------------------------------- */
let _db: ReturnType<typeof getFirestore>;

try {
  _db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch {
  // Already initialized — just get the existing instance
  _db = getFirestore(app);
}

export const db = _db;

/* ---------------------------------------
   SECTION E — Storage
---------------------------------------- */
export const storage = getStorage(app);

/* ---------------------------------------
   SECTION F — Dev guard
   Warns if env vars are missing so you
   catch config errors early
---------------------------------------- */
if (__DEV__) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    console.warn(
      '[Firebase] Missing env vars:',
      missing.join(', '),
      '\nCheck your .env file and make sure all EXPO_PUBLIC_ keys are set.'
    );
  }
}