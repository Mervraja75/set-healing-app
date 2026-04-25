// =======================================
// PlayerContext.tsx
// Global audio + player state
// Day 54 — Bass, Volume, Frequency lifted to context
// Day 55 — Playlist support added
// =======================================

import React, { createContext, useContext, useMemo, useState } from 'react';

// ---------------------------------------
// SECTION 1 — Types
// ---------------------------------------
export type PlaylistTrack = {
  id: string;
  title: string;
  description: string;
  sound: string;
  audioUrl?: string;
};

type PlayerContextType = {
  // Playback
  isPlaying:         boolean;
  setIsPlaying:      (v: boolean) => void;

  // Category tracking
  lastCategory:      string | null;
  setLastCategory:   (v: string | null) => void;

  // Day 54 — Audio controls (shared with Practitioner)
  bassLevel:         number;        // 0–100
  setBassLevel:      (v: number) => void;
  volume:            number;        // 0–1
  setVolume:         (v: number) => void;
  frequency:         number;        // Hz
  setFrequency:      (v: number) => void;

  // Day 55 — Playlist
  playlist:          PlaylistTrack[];
  currentTrackIndex: number;
  currentTrack:      PlaylistTrack | null;
  hasNext:           boolean;
  hasPrev:           boolean;
  setPlaylist:       (tracks: PlaylistTrack[], startIndex?: number) => void;
  goToNextTrack:     () => void;
  goToPrevTrack:     () => void;
};

// ---------------------------------------
// SECTION 2 — Context
// ---------------------------------------
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// ---------------------------------------
// SECTION 3 — Provider
// ---------------------------------------
export function PlayerProvider({ children }: { children: React.ReactNode }) {

  const [isPlaying,         setIsPlaying]        = useState(false);
  const [lastCategory,      setLastCategory]      = useState<string | null>(null);

  // Day 54
  const [bassLevel,         setBassLevel]         = useState(30);
  const [volume,            setVolume]            = useState(1);
  const [frequency,         setFrequency]         = useState(440);

  // Day 55
  const [playlist,          setPlaylistState]     = useState<PlaylistTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const setPlaylist = (tracks: PlaylistTrack[], startIndex = 0) => {
    setPlaylistState(tracks);
    setCurrentTrackIndex(startIndex);
  };

  const goToNextTrack = () =>
    setCurrentTrackIndex((i) => Math.min(i + 1, playlist.length - 1));

  const goToPrevTrack = () =>
    setCurrentTrackIndex((i) => Math.max(i - 1, 0));

  const currentTrack = playlist[currentTrackIndex] ?? null;
  const hasNext      = currentTrackIndex < playlist.length - 1;
  const hasPrev      = currentTrackIndex > 0;

  const value = useMemo(() => ({
    isPlaying,    setIsPlaying,
    lastCategory, setLastCategory,
    bassLevel,    setBassLevel,
    volume,       setVolume,
    frequency,    setFrequency,
    playlist,     currentTrackIndex,
    currentTrack, hasNext,           hasPrev,
    setPlaylist,  goToNextTrack,     goToPrevTrack,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [isPlaying, lastCategory, bassLevel, volume, frequency,
       playlist, currentTrackIndex]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

// ---------------------------------------
// SECTION 4 — Hook
// ---------------------------------------
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}