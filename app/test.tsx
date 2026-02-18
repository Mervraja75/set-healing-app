// =======================================
// PLAYER SCREEN (Day 34 — STABILIZED)
// Volume + Loop + Metadata + Progress (Read-Only)
// Uses setOnPlaybackStatusUpdate (no timers)
// Includes audio teardown + guards
// =======================================

// QUICK INDEX (search these tags)
// - SECTION 2: Sound map (add new tracks)
// - SECTION 4C: Local state (new controls state)
// - SECTION 6: Teardown logic (stop/unload behavior)
// - SECTION 7: Play/Stop logic (core audio start/stop)
// - SECTION 8: Controls (volume/loop/seek)
// - SECTION 10: UI layout (screen UI blocks)
// - SECTION 11: Styles (visual polish)

/* ---------------------------------------
   SECTION 1 — Imports
---------------------------------------- */
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '@/components/BackButton';
import CustomSlider from '@/components/CustomSlider';
import { usePlayer } from '@/context/PlayerContext';

/* ---------------------------------------
   SECTION 2 — Static data (Sound Map)
   ✅ Add more categories/sounds here later
---------------------------------------- */
const SOUND_MAP: Record<string, any> = {
  sleep: require('../assets/sounds/sleep.mp3'),
  calm: require('../assets/sounds/calm.mp3'),
  focus: require('../assets/sounds/focus.mp3'),
  energy: require('../assets/sounds/energy.mp3'),
};

/* ---------------------------------------
   SECTION 3 — Helpers / Utils
   ✅ Add formatting helpers here
---------------------------------------- */
const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/* ---------------------------------------
   SECTION 4 — Component
---------------------------------------- */
export default function TestScreen() {
  /* -------------------------------------
     SECTION 4A — Route params
     ✅ Anything passed from Home/Healing -> Player
  -------------------------------------- */
  const { title, description, sound } = useLocalSearchParams<{
    title?: string;
    description?: string;
    sound?: string;
  }>();

  /* -------------------------------------
     SECTION 4B — Global context
     ✅ Shared app-level playback flags
  -------------------------------------- */
  const { isPlaying, setIsPlaying } = usePlayer();

  /* -------------------------------------
     SECTION 4C — Local state
     ✅ Player state for THIS screen only
  -------------------------------------- */
  const [audio, setAudio] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  // Progress state
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  /* -------------------------------------
     SECTION 4D — Derived values
     ✅ Display-only computed values
  -------------------------------------- */
  const trackLabel = (sound ?? 'sleep').toString().toUpperCase();
  const progressPercent = Math.min(position / duration, 1);

  /* -------------------------------------
     SECTION 5 — Audio mode setup
     ✅ iOS silent mode support
  -------------------------------------- */
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  /* -------------------------------------
     SECTION 6 — Audio lifecycle helpers
     ✅ Teardown / cleanup logic
  -------------------------------------- */
  const teardownAudio = async () => {
    if (!audio) return;

    try {
      // Remove callback first
      try {
        audio.setOnPlaybackStatusUpdate(null);
      } catch {}

      // Stop and unload safely
      try {
        await audio.stopAsync();
      } catch {}
      try {
        await audio.unloadAsync();
      } catch {}
    } catch {
      // best-effort
    } finally {
      // Reset state
      setAudio(null);
      setIsPlaying(false);
      setPosition(0);
      setDuration(1);
      setIsLoading(false);
    }
  };

  /* -------------------------------------
     SECTION 7 — Main Play/Stop handler
     ✅ Core button logic
  -------------------------------------- */
  const handleToggleSound = async () => {
    if (isLoading) return;

    setIsLoading(true);

    // STOP
    if (audio) {
      await teardownAudio();
      return;
    }

    // PLAY
    try {
      await teardownAudio(); // safety

      const source = SOUND_MAP[sound ?? 'sleep'];

      const { sound: newSound } = await Audio.Sound.createAsync(source, {
        shouldPlay: true,
        isLooping,
        volume,
      });

      // ✅ Playback progress listener (moves progress bar)
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 1);

        if (status.didJustFinish && !status.isLooping) {
          setIsPlaying(false);
        }
      });

      setAudio(newSound);
      setIsPlaying(true);
    } catch {
      try {
        await teardownAudio();
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------
     SECTION 8 — Controls (Volume + Loop)
     ✅ Add more controls here later:
     - seek()
     - skip()
     - speed()
  -------------------------------------- */
  const handleVolumeChange = async (v: number) => {
    setVolume(v);
    if (!audio) return;

    try {
      const status = await audio.getStatusAsync();
      if (status.isLoaded) await audio.setVolumeAsync(v);
    } catch {}
  };

  const handleLoopToggle = async () => {
    const next = !isLooping;
    setIsLooping(next);

    if (!audio) return;

    try {
      const status = await audio.getStatusAsync();
      if (status.isLoaded) await audio.setIsLoopingAsync(next);
    } catch {}
  };

  /* -------------------------------------
     SECTION 9 — Cleanup on unmount
     ✅ Ensures no memory leaks
  -------------------------------------- */
  useEffect(() => {
    return () => {
      teardownAudio().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------------
     SECTION 10 — UI Layout
     ✅ Add UI blocks here:
     - headers
     - buttons
     - sliders
     - cards
  -------------------------------------- */
  return (
    <View style={styles.container}>
      {/* Top-left back */}
      <View style={styles.topBar}>
        <BackButton />
      </View>

      {/* Title + metadata */}
      <Text style={styles.title}>{title ?? 'Category'}</Text>
      <Text style={styles.meta}>{trackLabel}</Text>

      {/* Description */}
      <Text style={styles.description}>
        {description ?? 'Listen and relax.'}
      </Text>

      {/* Play/Stop */}
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

      {/* Progress Bar */}
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
    </View>
  );
}

/* ---------------------------------------
   SECTION 11 — Styles
   ✅ Add new styles here as UI grows
---------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    paddingHorizontal: 28,
    paddingTop: 24,
  },

  topBar: {
    position: 'absolute',
    top: 55,
    left: 18,
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
});