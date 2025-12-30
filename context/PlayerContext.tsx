import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

// -------------------------------
// Types
// -------------------------------
type PlayerState = {
  lastCategory: string | null;
  isPlaying: boolean;
  setLastCategory: (category: string) => void;
  setIsPlaying: (playing: boolean) => void;
};

// -------------------------------
// Context
// -------------------------------
const PlayerContext = createContext<PlayerState | null>(null);

const CATEGORY_KEY = 'lastCategory';
const PLAYING_KEY = 'isPlaying';

// -------------------------------
// Provider
// -------------------------------
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [lastCategory, setLastCategoryState] = useState<string | null>(null);
  const [isPlaying, setIsPlayingState] = useState(false);

  // Load saved state on app start
  useEffect(() => {
    (async () => {
      try {
        const savedCategory = await AsyncStorage.getItem(CATEGORY_KEY);
        const savedPlaying = await AsyncStorage.getItem(PLAYING_KEY);

        if (savedCategory) setLastCategoryState(savedCategory);
        if (savedPlaying) setIsPlayingState(savedPlaying === 'true');
      } catch {
        console.warn('Failed to load player state');
      }
    })();
  }, []);

  const setLastCategory = async (category: string) => {
    setLastCategoryState(category);
    await AsyncStorage.setItem(CATEGORY_KEY, category);
  };

  const setIsPlaying = async (playing: boolean) => {
    setIsPlayingState(playing);
    await AsyncStorage.setItem(PLAYING_KEY, String(playing));
  };

  return (
    <PlayerContext.Provider
      value={{ lastCategory, isPlaying, setLastCategory, setIsPlaying }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// -------------------------------
// Hook
// -------------------------------
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used inside PlayerProvider');
  }
  return context;
}
