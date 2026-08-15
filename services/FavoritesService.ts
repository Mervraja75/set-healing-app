// =======================================
// services/FavoritesService.ts
// Firestore-backed per-user favorites
// Path: users/{uid}/favorites/{type_itemId}
// =======================================

import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type FavoriteType = 'track' | 'meditation' | 'chakra' | 'element' | 'composition';

export type FavoriteInput = {
  type: FavoriteType;
  itemId: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
  sound?: string;
  audioUrl?: string;
};

export type FavoriteRecord = FavoriteInput & {
  docId: string;
  createdAt?: any;
};

/* ──────────────────────────────────────
   Doc id — deterministic so favoriting
   twice never creates duplicates
────────────────────────────────────────*/
export function favoriteDocId(type: FavoriteType, itemId: string): string {
  return `${type}_${itemId}`;
}

function favoritesCollection(uid: string) {
  return collection(db, 'users', uid, 'favorites');
}

/* ──────────────────────────────────────
   subscribeFavorites
   Live listener — local cache (see lib/firebase.ts)
   means this resolves instantly from cache too.
────────────────────────────────────────*/
export function subscribeFavorites(
  uid: string,
  onChange: (favorites: FavoriteRecord[]) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    favoritesCollection(uid),
    (snap: QuerySnapshot<DocumentData>) => {
      const items: FavoriteRecord[] = snap.docs.map((d) => {
        const data = d.data() as FavoriteInput & { createdAt?: any };
        return { docId: d.id, ...data };
      });
      onChange(items);
    },
    (err) => {
      console.error('[FavoritesService] subscribeFavorites error:', err);
      onError?.(err);
    }
  );
}

export async function addFavorite(uid: string, item: FavoriteInput): Promise<void> {
  const docId = favoriteDocId(item.type, item.itemId);
  await setDoc(doc(favoritesCollection(uid), docId), {
    ...item,
    createdAt: serverTimestamp(),
  });
}

export async function removeFavorite(uid: string, type: FavoriteType, itemId: string): Promise<void> {
  const docId = favoriteDocId(type, itemId);
  await deleteDoc(doc(favoritesCollection(uid), docId));
}
