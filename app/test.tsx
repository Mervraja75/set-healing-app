// =======================================
// PLAYER SCREEN (Day 23)
// Polished UI + Stable expo-av player
// =======================================

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
  const { title, description, sound } = useLocalSearchParams<{
    title?: string;
    description?: string;
    sound?: string;
  }>();

  const { isPlaying, setIsPlaying } = usePlayer();

  const [audio, setAudio] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------
  // Enable audio in silent mode (iOS)
  // -------------------------------
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true, // 🔑 important for meditation apps
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // -------------------------------
  // Play / Stop Handler
  // -------------------------------
  const handleToggleSound = async () => {
    if (isLoading) return;

    // STOP
    if (audio) {
      setIsLoading(true);
      await audio.stopAsync();
      await audio.unloadAsync();
      setAudio(null);
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    // PLAY
    try {
      setIsLoading(true);
      const source = SOUND_MAP[sound ?? 'sleep'];

      const { sound: newSound } = await Audio.Sound.createAsync(
        source,
        {
          shouldPlay: true,
          isLooping: true, // 🔁 loop for healing sessions
          volume: 1,
        }
      );

      setAudio(newSound);
      setIsPlaying(true);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Auto-resume (optional behavior)
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
  // UI
  // -------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Category'}</Text>

      <Text style={styles.description}>
        {description ?? 'Listen and relax.'}
      </Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleToggleSound}
        disabled={isLoading}
        activeOpacity={0.85}
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
// Styles (UI Polish)
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3A0CA3',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6D5BD0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#5A189A',
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 999,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  back: {
    marginTop: 20,
    fontSize: 15,
    color: '#5A189A',
    opacity: 0.8,
  },
});
