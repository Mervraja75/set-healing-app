// =======================================
// PlayerContext.tsx
// Handles global audio/player-related state
// =======================================

import React, { createContext, useContext, useMemo, useState } from 'react';

// ---------------------------------------
// SECTION 1 — Types
// Define what this context exposes
// ---------------------------------------
type PlayerContextType = {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;

  lastCategory: string | null;
  setLastCategory: (v: string | null) => void;
};

// ---------------------------------------
// SECTION 2 — Context creation
// ---------------------------------------
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// ---------------------------------------
// SECTION 3 — Provider component
// Wraps the app and holds player state
// ---------------------------------------
export function PlayerProvider({ children }: { children: React.ReactNode }) {

  // -------------------------------------
  // SECTION 3A — State
  // -------------------------------------
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastCategory, setLastCategory] = useState<string | null>(null);

  // -------------------------------------
  // SECTION 4 — Actions
  // Functions that modify player state
  // -------------------------------------
  // (currently exposed directly via setters)
  // Future actions could live here:
  // - startPlayback()
  // - stopPlayback()
  // - setCategoryAndPlay()

  // -------------------------------------
  // SECTION 5 — Memoized context value
  // What gets exposed to the app
  // -------------------------------------
  const value = useMemo(
    () => ({
      isPlaying,
      setIsPlaying,
      lastCategory,
      setLastCategory,
    }),
    [isPlaying, lastCategory]
  );

  // -------------------------------------
  // SECTION 6 — Provider return
  // -------------------------------------
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

// ---------------------------------------
// SECTION 7 — Hook
// Used by screens/components
// ---------------------------------------
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}