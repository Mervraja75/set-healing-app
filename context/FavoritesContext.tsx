// =======================================
// FavoritesContext.tsx
// Global per-user favorites state (Firestore-backed)
// =======================================

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  addFavorite,
  favoriteDocId,
  FavoriteInput,
  FavoriteRecord,
  FavoriteType,
  removeFavorite,
  subscribeFavorites,
} from '@/services/FavoritesService';

// ---------------------------------------
// SECTION 1 — Context API
// ---------------------------------------
type FavoritesContextType = {
  favorites: FavoriteRecord[];
  loading:   boolean;
  isFavorited:    (type: FavoriteType, itemId: string) => boolean;
  toggleFavorite: (item: FavoriteInput) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// ---------------------------------------
// SECTION 2 — Provider
// ---------------------------------------
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid || null;

  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading,   setLoading]   = useState(false);

  // Subscribe/unsubscribe as the signed-in user changes
  useEffect(() => {
    if (!uid) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeFavorites(
      uid,
      (items) => { setFavorites(items); setLoading(false); },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [uid]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.docId)), [favorites]);

  const isFavorited = useCallback(
    (type: FavoriteType, itemId: string) => favoriteIds.has(favoriteDocId(type, itemId)),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (item: FavoriteInput) => {
      if (!uid) return;
      if (isFavorited(item.type, item.itemId)) {
        await removeFavorite(uid, item.type, item.itemId);
      } else {
        await addFavorite(uid, item);
      }
    },
    [uid, isFavorited]
  );

  const value = useMemo(
    () => ({ favorites, loading, isFavorited, toggleFavorite }),
    [favorites, loading, isFavorited, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// ---------------------------------------
// SECTION 3 — Hook
// ---------------------------------------
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
