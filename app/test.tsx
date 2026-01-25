// =======================================
// PLAYER SCREEN (Day 34 — STABILIZED)
// Volume + Loop + Metadata + Progress (Read-Only)
// Uses setOnPlaybackStatusUpdate (no timers)
// Includes audio teardown + guards
// =======================================

import { Audio } from 'expo-av';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomSlider from '@/components/CustomSlider';
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
// Helpers
// -------------------------------
const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  // ✅ Progress state
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  const trackLabel = (sound ?? 'sleep').toString().toUpperCase();

  // -------------------------------
  // Enable audio in silent mode (iOS)
  // -------------------------------
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  // -------------------------------
  // Teardown helper (safe)
  // -------------------------------
  const teardownAudio = async () => {
    if (!audio) return;

    try {
      // Remove status update callback first
      try {
        audio.setOnPlaybackStatusUpdate(null);
      } catch {}

      // stop and unload
      try {
        await audio.stopAsync();
      } catch {}
      try {
        await audio.unloadAsync();
      } catch {}
    } catch {
      // swallow any errors — teardown must be best-effort
    } finally {
      // reset local state
      setAudio(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(1);
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Play / Stop Handler (stabilized)
  // -------------------------------
  const handleToggleSound = async () => {
    // Prevent re-entry
    if (isLoading) return;

    setIsLoading(true);

    // If already playing, teardown and return
    if (audio) {
      await teardownAudio();
      return;
    }

    // Start playback (ensure previous audio cleaned up)
    try {
      // Extra safety: ensure any previous instance removed
      await teardownAudio();

      const source = SOUND_MAP[sound ?? 'sleep'];

      const { sound: newSound } = await Audio.Sound.createAsync(source, {
        shouldPlay: true,
        isLooping,
        volume,
      });

      // Attach progress listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 1);

        // keep global playing state in sync
        if (status.didJustFinish && !status.isLooping) {
          setIsPlaying(false);
        }
      });

      setAudio(newSound);
      setIsPlaying(true);
    } catch (err) {
      // if anything failed, ensure we are cleaned up
      try {
        await teardownAudio();
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // Volume
  // -------------------------------
  const handleVolumeChange = async (v: number) => {
    setVolume(v);
    if (!audio) return;

    try {
      const status = await audio.getStatusAsync();
      if (status.isLoaded) await audio.setVolumeAsync(v);
    } catch {}
  };

  // -------------------------------
  // Loop toggle
  // -------------------------------
  const handleLoopToggle = async () => {
    const next = !isLooping;
    setIsLooping(next);

    if (!audio) return;

    try {
      const status = await audio.getStatusAsync();
      if (status.isLoaded) await audio.setIsLoopingAsync(next);
    } catch {}
  };

  // -------------------------------
  // Cleanup on unmount — single point
  // -------------------------------
  useEffect(() => {
    return () => {
      // best-effort teardown
      teardownAudio().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPercent = Math.min(position / duration, 1);

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Category'}</Text>
      <Text style={styles.meta}>{trackLabel}</Text>

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

      {/* ✅ Progress Bar */}
      <View style={styles.progressBox}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Loop toggle */}
      <TouchableOpacity
        style={[styles.loopButton, !isLooping && styles.loopButtonOff]}
        onPress={handleLoopToggle}
        activeOpacity={0.85}
      >
        <Text style={styles.loopText}>Loop: {isLooping ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>

      {/* Volume */}
      <View style={{ width: '100%', maxWidth: 340 }}>
        <CustomSlider
          label="Volume"
          value={volume}
          onChange={handleVolumeChange}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          unit="%"
        />
      </View>

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
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3A0CA3',
    marginBottom: 4,
    textAlign: 'center',
  },
  meta: {
    fontSize: 12,
    color: '#5A189A',
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6D5BD0',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#5A189A',
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 999,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },

  progressBox: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 18,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E6DCF7',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5A189A',
  },
  timeRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: { fontSize: 12, color: '#777' },

  loopButton: {
    backgroundColor: '#EEE6FF',
    borderWidth: 1,
    borderColor: '#CDB8F5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginBottom: 14,
  },
  loopButtonOff: { backgroundColor: '#FFF' },
  loopText: { color: '#5A189A', fontWeight: '700', fontSize: 13 },

  back: { marginTop: 14, fontSize: 15, color: '#5A189A', opacity: 0.8 },
});