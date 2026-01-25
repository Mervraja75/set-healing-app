import React, { createContext, useContext, useMemo, useState } from 'react';

type PlayerContextType = {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;

  lastCategory: string | null;
  setLastCategory: (v: string | null) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastCategory, setLastCategory] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      isPlaying,
      setIsPlaying,
      lastCategory,
      setLastCategory,
    }),
    [isPlaying, lastCategory]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}