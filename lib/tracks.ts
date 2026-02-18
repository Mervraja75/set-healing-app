// lib/tracks.ts
// =======================================
// Firestore helpers for Categories & Tracks
// - read helpers used by the app (Home / Healing / Categories)
// - small admin helper to save track metadata (used later by admin UI)
// =======================================

import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';

// -------------------------------
// Types
// -------------------------------
export type Category = {
  id: string;
  title: string;
  description?: string;
  createdAt?: any;
};

export type Track = {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  storagePath?: string; // path in Firebase Storage
  durationSec?: number;
  createdAt?: any;
};

// -------------------------------
// SECTION A — Collections helpers
// (change names here if your Firestore uses different node names)
// -------------------------------
const CATEGORIES_COLLECTION = 'categories';
const TRACKS_COLLECTION = 'tracks';

// -------------------------------
// SECTION B — Read helpers
// - getCategories(): fetches all categories (ordered by createdAt if present)
// - getTracksByCategory(catId): fetches tracks for a category
// -------------------------------
export async function getCategories(): Promise<Category[]> {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const snap = await getDocs(colRef);
    const items: Category[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Category, 'id'>),
    }));
    return items;
  } catch (err) {
    console.warn('getCategories error', err);
    return [];
  }
}

export async function getTracksByCategory(categoryId: string): Promise<Track[]> {
  try {
    const colRef = collection(db, TRACKS_COLLECTION);
    const q = query(colRef, where('categoryId', '==', categoryId));
    const snap = await getDocs(q);
    const items: Track[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Track, 'id'>),
    }));
    return items;
  } catch (err) {
    console.warn('getTracksByCategory error', err);
    return [];
  }
}

// -------------------------------
// SECTION C — Admin helper (save track metadata)
// - addTrackMetadata: creates a new track document pointing to a storage path
//   (you will upload the actual audio to Storage separately)
// -------------------------------
export async function addTrackMetadata(payload: {
  title: string;
  description?: string;
  categoryId: string;
  storagePath: string; // e.g. "tracks/sleep/sleep_v1.mp3"
  durationSec?: number;
}) {
  try {
    const colRef = collection(db, TRACKS_COLLECTION);
    const docRef = await addDoc(colRef, {
      title: payload.title,
      description: payload.description ?? '',
      categoryId: payload.categoryId,
      storagePath: payload.storagePath,
      durationSec: payload.durationSec ?? null,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (err) {
    console.error('addTrackMetadata error', err);
    throw err;
  }
}

// -------------------------------
// NOTES:
// - This file assumes simple collection names: "categories" and "tracks".
//   If your Firestore uses different names, update the constants above.
// - For pagination / ordering / indexing, add ordering clauses as needed.
// - The admin flow will need Firebase Storage upload; this file only saves metadata.
// -------------------------------