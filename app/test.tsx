// =======================================
// PLAYER SCREEN (Day 20)
// Persist Play State + UX Improvements
// =======================================

// -------------------------------
// Imports
// -------------------------------
import { Audio } from 'expo-av';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { usePlayer } from '@/context/PlayerContext';

// -------------------------------
// Sound Map
// -------------------------------
const SOUND_MAP: Record<string, any> = {
  sleep: require('../assets/sounds/sleep.mp3'),
  calm: require('../assets/sounds/calm.mp3'),
  focus: require('../assets/sounds/focus.mp3'),
  energy: require('../assets/sounds/energy.mp3'),
};

// -------------------------------
// Player Screen Component
// -------------------------------
export default function TestScreen() {
  // -------------------------------
  // Route params
  // -------------------------------
  const { title, description, sound } = useLocalSearchParams<{
    title?: string;
    description?: string;
    sound?: string;
  }>();

  // -------------------------------
  // Global player state
  // -------------------------------
  const { isPlaying, setIsPlaying } = usePlayer();

  // -------------------------------
  // Local state
  // -------------------------------
  const [audio, setAudio] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------
  // Play / Stop Handler
  // -------------------------------
  const handleToggleSound = async () => {
    if (isLoading) return;

    // Stop audio
    if (audio) {
      setIsLoading(true);
      await audio.stopAsync();
      await audio.unloadAsync();
      setAudio(null);
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    // Play audio
    try {
      setIsLoading(true);

      const source = SOUND_MAP[sound ?? 'sleep'];
      const { sound: newSound } = await Audio.Sound.createAsync(source);

      setAudio(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Auto-resume if playing
  // -------------------------------
  useEffect(() => {
    if (isPlaying && !audio) {
      handleToggleSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------
  // Cleanup on unmount
  // -------------------------------
  useEffect(() => {
    return () => {
      if (audio) {
        audio.unloadAsync();
      }
    };
  }, [audio]);

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Category'}</Text>

      <Text style={styles.description}>
        {description ?? 'Listen and relax.'}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          isLoading && styles.buttonDisabled,
        ]}
        onPress={handleToggleSound}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading…' : isPlaying ? 'Stop' : 'Play'}
        </Text>
      </TouchableOpacity>

      <Link href="/categories" asChild>
        <Text style={styles.back}>← Back to Categories</Text>
      </Link>
    </View>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#5A189A',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  back: {
    fontSize: 16,
    color: '#5A189A',
  },
});
