// =======================================
// PLAYER SCREEN — test.tsx
// Day 54 — Bass layer
// Day 55 — Playlist support
// Day 61 — Frequency engine
// Day 62 — Bass intensity refinements
// Day 63 — Logarithmic frequency slider + band display
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '@/components/BackButton';
import CustomSlider from '@/components/CustomSlider';
import { usePlayer } from '@/context/PlayerContext';
import {
  bassLevelToVolume,
  FREQUENCY_PRESETS,
  FREQUENCY_RANGES,
  frequencyEngine,
  getClosestPreset,
  getRangeForHz,
  hzToSlider,
  sliderToHz,
} from '@/services/FrequencyEngine';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#120828',
  bgCard:       '#1E0A30',
  bgCardDeep:   '#250D3D',
  bgHero:       '#2D0F50',
  goldBright:   '#D4A828',
  goldMid:      '#C8920A',
  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',
  borderGold:   'rgba(212, 168, 40, 0.18)',
  borderPurple: 'rgba(180, 140, 255, 0.10)',
  glowGold:     'rgba(212, 168, 40, 0.12)',
  glowPurple:   'rgba(100, 50, 180, 0.15)',
  aurora:       '#7EFFD4',
};

/* ---------------------------------------
   SOUND MAP
---------------------------------------- */
const SOUND_MAP: Record<string, any> = {
  sleep:  require('../assets/sounds/sleep.mp3'),
  calm:   require('../assets/sounds/calm.mp3'),
  focus:  require('../assets/sounds/focus.mp3'),
  energy: require('../assets/sounds/energy.mp3'),
};

/* ---------------------------------------
   BASS PRESETS
---------------------------------------- */
type BassPreset = {
  id: string; label: string; level: number; rate: number; hint: string;
};

const BASS_PRESETS: BassPreset[] = [
  { id: 'off',     label: 'Off',     level: 0,  rate: 1.0,  hint: 'No bass layer'                     },
  { id: 'subtle',  label: 'Subtle',  level: 20, rate: 0.92, hint: 'Gentle warmth, barely perceptible'  },
  { id: 'natural', label: 'Natural', level: 40, rate: 0.88, hint: 'Balanced body resonance'            },
  { id: 'deep',    label: 'Deep',    level: 65, rate: 0.82, hint: 'Strong low-frequency immersion'     },
  { id: 'intense', label: 'Intense', level: 85, rate: 0.75, hint: 'Maximum subharmonic depth'          },
];

/* ---------------------------------------
   HELPERS
---------------------------------------- */
const formatTime = (millis: number) => {
  const s = Math.floor(millis / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
};

const getSource = (sound?: string, audioUrl?: string) => {
  if (audioUrl) return { uri: audioUrl };
  return SOUND_MAP[(sound ?? 'sleep').toLowerCase()] ?? SOUND_MAP.sleep;
};

const bassToIndicator = (level: number) => Math.max(0.05, level / 100);

/* ---------------------------------------
   DAY 63 — Frequency Band Display
   Shows all brainwave bands as a horizontal
   bar with the active range highlighted
---------------------------------------- */
function FrequencyBandDisplay({ hz }: { hz: number }) {
  const activeRange = getRangeForHz(hz);

  return (
    <View style={bandStyles.wrap}>
      {/* Band segments */}
      <View style={bandStyles.track}>
        {FREQUENCY_RANGES.map((range) => {
          const isActive = range.id === activeRange.id;
          return (
            <View
              key={range.id}
              style={[
                bandStyles.segment,
                { backgroundColor: isActive ? range.color : 'rgba(255,255,255,0.06)' },
                isActive && { shadowColor: range.color, shadowOpacity: 0.6, shadowRadius: 8, elevation: 4 },
              ]}
            />
          );
        })}
      </View>

      {/* Range labels */}
      <View style={bandStyles.labels}>
        {FREQUENCY_RANGES.map((range) => {
          const isActive = range.id === activeRange.id;
          return (
            <Text
              key={range.id}
              style={[
                bandStyles.label,
                isActive && { color: range.color, fontWeight: '700' },
              ]}
            >
              {range.label}
            </Text>
          );
        })}
      </View>

      {/* Active range detail */}
      <View style={bandStyles.detail}>
        <Text style={[bandStyles.detailRange, { color: activeRange.color }]}>
          {activeRange.label} · {activeRange.min}–{activeRange.max} Hz
        </Text>
        <Text style={bandStyles.detailDesc}>{activeRange.desc}</Text>
      </View>
    </View>
  );
}

const bandStyles = StyleSheet.create({
  wrap:        { width: '100%', paddingHorizontal: 18, paddingBottom: 4 },
  track:       { flexDirection: 'row', gap: 3, height: 8, borderRadius: 99, overflow: 'hidden', marginBottom: 6 },
  segment:     { flex: 1, borderRadius: 99 },
  labels:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label:       { fontSize: 8, letterSpacing: 1, color: '#4A2A6A', textAlign: 'center', flex: 1, textTransform: 'uppercase' },
  detail:      { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  detailRange: { fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 3 },
  detailDesc:  { fontSize: 10, color: '#7A60A0', fontWeight: '300', lineHeight: 15 },
});

/* ---------------------------------------
   MAIN COMPONENT
---------------------------------------- */
export default function TestScreen() {

  const {
    isPlaying,    setIsPlaying,
    volume,       setVolume,
    bassLevel,    setBassLevel,
    frequency,    setFrequency,
    currentTrack, playlist, currentTrackIndex,
    goToNextTrack, goToPrevTrack,
    hasNext, hasPrev,
  } = usePlayer();

  const [audio,         setAudio]        = useState<Audio.Sound | null>(null);
  const [bassAudio,     setBassAudio]    = useState<Audio.Sound | null>(null);
  const [isLoading,     setIsLoading]    = useState(false);
  const [isLooping,     setIsLooping]    = useState(false);
  const [position,      setPosition]     = useState(0);
  const [duration,      setDuration]     = useState(1);

  const [bassRate,      setBassRate]     = useState(0.88);
  const [bassPresetId,  setBassPresetId] = useState('natural');
  const [freqEnabled,   setFreqEnabled]  = useState(false);
  const [freqIntensity, setFreqIntensity]= useState(30);

  // Day 63 — slider position (0–100) drives Hz via log scale
  const [sliderPos, setSliderPos] = useState(() => hzToSlider(frequency));

  const hasNextRef   = useRef(hasNext);
  const goToNextRef  = useRef(goToNextTrack);
  const isLoopingRef = useRef(isLooping);
  useEffect(() => { hasNextRef.current   = hasNext; },       [hasNext]);
  useEffect(() => { goToNextRef.current  = goToNextTrack; }, [goToNextTrack]);
  useEffect(() => { isLoopingRef.current = isLooping; },     [isLooping]);

  const title        = currentTrack?.title       ?? 'Session';
  const description  = currentTrack?.description ?? 'Listen and relax.';
  const sound        = currentTrack?.sound;
  const audioUrl     = currentTrack?.audioUrl;
  const trackLabel   = audioUrl ? 'UPLOADED TRACK' : (sound ?? 'sleep').toUpperCase();
  const progressPct  = Math.min(position / duration, 1);
  const currentPreset = getClosestPreset(frequency);
  const activeRange   = getRangeForHz(frequency);

  /* ── Audio mode ── */
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false, staysActiveInBackground: false,
      playsInSilentModeIOS: true, shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  /* ── Teardown ── */
  const teardown = async () => {
    if (audio) {
      try { audio.setOnPlaybackStatusUpdate(null); } catch {}
      try { await audio.stopAsync(); }   catch {}
      try { await audio.unloadAsync(); } catch {}
    }
    if (bassAudio) {
      try { await bassAudio.stopAsync(); }   catch {}
      try { await bassAudio.unloadAsync(); } catch {}
    }
    setAudio(null);
    setBassAudio(null);
    setIsPlaying(false);
    setPosition(0);
    setDuration(1);
    setIsLoading(false);
  };

  /* ── Start playback ── */
  const startPlayback = async () => {
    try {
      const source = getSource(sound, audioUrl);

      const { sound: main } = await Audio.Sound.createAsync(source, {
        shouldPlay: true, isLooping, volume,
      });
      main.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 1);
        if (status.didJustFinish && !isLoopingRef.current) {
          if (hasNextRef.current) goToNextRef.current();
          else setIsPlaying(false);
        }
      });

      if (bassLevel > 0) {
        const { sound: bass } = await Audio.Sound.createAsync(source, {
          shouldPlay: true, isLooping,
          volume: bassLevelToVolume(bassLevel),
          rate: bassRate, shouldCorrectPitch: false,
        });
        setBassAudio(bass);
      }

      if (freqEnabled) await frequencyEngine.start(frequency, freqIntensity, bassLevel > 0);

      setAudio(main);
      setIsPlaying(true);
    } catch (err) {
      console.error('Playback error:', err);
      await teardown();
    }
  };

  /* ── Track change ── */
  const prevTrackId = useRef<string | null>(null);
  useEffect(() => {
    const newId = currentTrack?.id ?? null;
    if (newId && newId !== prevTrackId.current) {
      prevTrackId.current = newId;
      if (isPlaying) {
        (async () => {
          setIsLoading(true);
          await teardown();
          await startPlayback();
          setIsLoading(false);
        })();
      } else {
        setPosition(0); setDuration(1);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  /* ── Play / Stop ── */
  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (audio) { await teardown(); await frequencyEngine.stop(); }
    else await startPlayback();
    setIsLoading(false);
  };

  /* ── Volume ── */
  const handleVolumeChange = async (v: number) => {
    setVolume(v);
    if (!audio) return;
    try { const s = await audio.getStatusAsync(); if (s.isLoaded) await audio.setVolumeAsync(v); } catch {}
  };

  /* ── Bass level ── */
  const handleBassChange = async (v: number) => {
    setBassLevel(v); setBassPresetId('custom');
    if (!bassAudio) return;
    try { const s = await bassAudio.getStatusAsync(); if (s.isLoaded) await bassAudio.setVolumeAsync(bassLevelToVolume(v)); } catch {}
  };

  /* ── Bass preset ── */
  const handleBassPreset = async (preset: BassPreset) => {
    setBassPresetId(preset.id);
    setBassLevel(preset.level);
    setBassRate(preset.rate);
    if (!isPlaying) return;
    if (preset.id === 'off') {
      if (bassAudio) {
        try { await bassAudio.stopAsync(); await bassAudio.unloadAsync(); } catch {}
        setBassAudio(null);
      }
      return;
    }
    if (bassAudio) {
      try { await bassAudio.stopAsync(); await bassAudio.unloadAsync(); } catch {}
      setBassAudio(null);
    }
    if (audio && preset.level > 0) {
      const source = getSource(sound, audioUrl);
      try {
        const { sound: bass } = await Audio.Sound.createAsync(source, {
          shouldPlay: true, isLooping,
          volume: bassLevelToVolume(preset.level),
          rate: preset.rate, shouldCorrectPitch: false,
        });
        setBassAudio(bass);
      } catch {}
    }
  };

  /* ── Loop ── */
  const handleLoopToggle = async () => {
    const next = !isLooping;
    setIsLooping(next);
    try {
      if (audio)     { const s = await audio.getStatusAsync();     if (s.isLoaded) await audio.setIsLoopingAsync(next); }
      if (bassAudio) { const s = await bassAudio.getStatusAsync(); if (s.isLoaded) await bassAudio.setIsLoopingAsync(next); }
    } catch {}
  };

  /* ── Next / Prev ── */
  const handleNext = async () => {
    if (!hasNext || isLoading) return;
    setIsLoading(true); await teardown(); goToNextTrack(); setIsLoading(false);
  };

  const handlePrev = async () => {
    if (!hasPrev || isLoading) return;
    if (position > 3000 && audio) {
      try {
        const s = await audio.getStatusAsync();
        if (s.isLoaded) await audio.setPositionAsync(0);
        if (bassAudio) { const bs = await bassAudio.getStatusAsync(); if (bs.isLoaded) await bassAudio.setPositionAsync(0); }
        setPosition(0); return;
      } catch {}
    }
    setIsLoading(true); await teardown(); goToPrevTrack(); setIsLoading(false);
  };

  /* ── Day 63 — Frequency slider (logarithmic) ── */
  const handleSliderChange = async (pos: number) => {
    const hz = sliderToHz(pos);
    setSliderPos(pos);
    setFrequency(hz);
    if (freqEnabled && isPlaying) await frequencyEngine.setFrequency(hz, freqIntensity);
  };

  // Snap to nearest preset on slider release
  const handleSliderComplete = async (pos: number) => {
    const hz           = sliderToHz(pos);
    const nearest      = getClosestPreset(hz);
    const snappedSlider = hzToSlider(nearest.hz);
    setSliderPos(snappedSlider);
    setFrequency(nearest.hz);
    if (freqEnabled && isPlaying) await frequencyEngine.setFrequency(nearest.hz, freqIntensity);
  };

  /* ── Range chip tap — jumps to first preset in range ── */
  const handleRangeChip = async (rangeId: string) => {
    const preset = FREQUENCY_PRESETS.find((p) => p.range === rangeId);
    if (!preset) return;
    setSliderPos(hzToSlider(preset.hz));
    setFrequency(preset.hz);
    if (freqEnabled && isPlaying) await frequencyEngine.setFrequency(preset.hz, freqIntensity);
  };

  /* ── Freq engine toggle / intensity ── */
  const handleFreqToggle = async () => {
    const next = !freqEnabled;
    setFreqEnabled(next);
    if (next && isPlaying) await frequencyEngine.start(frequency, freqIntensity, bassLevel > 0);
    else await frequencyEngine.stop();
  };

  const handleFreqIntensityChange = async (v: number) => {
    setFreqIntensity(v);
    if (freqEnabled && isPlaying) await frequencyEngine.setIntensity(v);
  };

  /* ── Cleanup ── */
  useEffect(() => {
    return () => { teardown().catch(() => {}); frequencyEngine.stop().catch(() => {}); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── UI ── */
  return (
    <ScrollView
      style={{ backgroundColor: C.bg }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.ringOuter} />
      <View style={styles.ringMid} />
      <View style={styles.ringInner} />

      <View style={styles.topBar}><BackButton /></View>

      {/* Playlist indicator */}
      {playlist.length > 1 && (
        <View style={styles.playlistIndicator}>
          <Text style={styles.playlistText}>{currentTrackIndex + 1} of {playlist.length}</Text>
          <View style={styles.playlistDots}>
            {playlist.map((_, i) => (
              <View key={i} style={[styles.playlistDot, i === currentTrackIndex && styles.playlistDotActive]} />
            ))}
          </View>
        </View>
      )}

      {/* Artwork */}
      <View style={styles.artworkWrap}>
        <View style={[styles.artwork, isPlaying && styles.artworkPlaying]}>
          <View style={styles.artworkGlow} />
          <Text style={styles.artworkSymbol}>
            {isLoading ? '◌' : isPlaying ? '◉' : '○'}
          </Text>
        </View>
        {freqEnabled && isPlaying && (
          <View style={[styles.freqRing, { borderColor: activeRange.color }]} />
        )}
        {isPlaying && bassLevel > 0 && (
          <>
            <View style={[styles.bassBar, styles.bassBarL, { height: 20 + bassToIndicator(bassLevel) * 40 }]} />
            <View style={[styles.bassBar, styles.bassBarR, { height: 20 + bassToIndicator(bassLevel) * 40 }]} />
            <View style={[styles.bassBar, styles.bassBarLi, { height: 12 + bassToIndicator(bassLevel) * 24 }]} />
            <View style={[styles.bassBar, styles.bassBarRi, { height: 12 + bassToIndicator(bassLevel) * 24 }]} />
          </>
        )}
      </View>

      {/* Track info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackLabel}>{trackLabel}</Text>
        <Text style={styles.trackTitle}>{title}</Text>
        <Text style={styles.trackDesc}>{description}</Text>
        {freqEnabled && (
          <View style={styles.freqActiveBadge}>
            <View style={[styles.freqActiveDot, { backgroundColor: activeRange.color }]} />
            <Text style={[styles.freqActiveText, { color: activeRange.color }]}>
              {currentPreset.label}
            </Text>
          </View>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct * 100}%` as any }]} />
          <View style={[styles.progressHead, { left: `${progressPct * 100}%` as any }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Transport */}
      <View style={styles.transport}>
        <TouchableOpacity style={[styles.skipBtn, !hasPrev && styles.skipBtnDisabled]} onPress={handlePrev} disabled={!hasPrev || isLoading} activeOpacity={0.75}>
          <Text style={[styles.skipIcon, !hasPrev && styles.skipIconDisabled]}>⏮</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.playBtn, isLoading && styles.playBtnDisabled]} onPress={handleToggle} disabled={isLoading} activeOpacity={0.82}>
          <Text style={styles.playBtnIcon}>{isLoading ? '◌' : isPlaying ? '■' : '▶'}</Text>
          <Text style={styles.playBtnText}>{isLoading ? 'Loading…' : isPlaying ? 'Stop' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.skipBtn, !hasNext && styles.skipBtnDisabled]} onPress={handleNext} disabled={!hasNext || isLoading} activeOpacity={0.75}>
          <Text style={[styles.skipIcon, !hasNext && styles.skipIconDisabled]}>⏭</Text>
        </TouchableOpacity>
      </View>

      {/* Loop toggle */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={[styles.ctrlPill, isLooping && styles.ctrlPillActive]} onPress={handleLoopToggle} activeOpacity={0.8}>
          <Text style={[styles.ctrlPillText, isLooping && styles.ctrlPillTextActive]}>↺  {isLooping ? 'Loop on' : 'Loop off'}</Text>
        </TouchableOpacity>
      </View>

      {/* Volume card */}
      <View style={styles.controlsCard}>
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Volume</Text>
            <Text style={styles.sliderValue}>{Math.round(volume * 100)}%</Text>
          </View>
          <CustomSlider label="" value={volume} onChange={handleVolumeChange} minimumValue={0} maximumValue={1} step={0.01} unit="%" />
        </View>
      </View>

      {/* Bass card */}
      <View style={styles.bassCard}>
        <View style={styles.bassCardBar} />
        <View style={styles.bassCardHeader}>
          <Text style={styles.bassCardTitle}>Bass</Text>
          <Text style={styles.bassCardValue}>{Math.round(bassLevel)}%</Text>
        </View>
        <View style={styles.presetRow}>
          {BASS_PRESETS.map((preset) => {
            const active = bassPresetId === preset.id;
            return (
              <TouchableOpacity key={preset.id} style={[styles.presetChip, active && styles.presetChipActive]} onPress={() => handleBassPreset(preset)} activeOpacity={0.75}>
                <Text style={[styles.presetChipText, active && styles.presetChipTextActive]}>{preset.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {bassPresetId !== 'custom' && (
          <Text style={styles.bassHint}>{BASS_PRESETS.find((p) => p.id === bassPresetId)?.hint ?? ''}</Text>
        )}
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Fine tune</Text>
            <Text style={styles.sliderValue}>{Math.round(bassLevel)}%</Text>
          </View>
          <CustomSlider label="" value={bassLevel} onChange={handleBassChange} minimumValue={0} maximumValue={100} step={1} unit="%" />
        </View>
        <View style={styles.sliderDivider} />
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Subharmonic rate</Text>
            <Text style={styles.sliderValue}>{bassRate.toFixed(2)}×</Text>
          </View>
          <CustomSlider label="" value={bassRate} onChange={(v) => setBassRate(parseFloat(v.toFixed(2)))} minimumValue={0.7} maximumValue={1.0} step={0.01} unit="×" />
          <Text style={styles.bassRateHint}>Lower = deeper pitch shift · Higher = subtle warmth</Text>
        </View>
      </View>

      {/* ── Day 63 — Frequency Engine card ── */}
      <View style={styles.freqCard}>
        <View style={[styles.freqCardBar, { backgroundColor: activeRange.color }]} />

        <View style={styles.freqCardHeader}>
          <Text style={styles.freqCardTitle}>Frequency Engine</Text>
          <TouchableOpacity
            style={[styles.freqToggle, freqEnabled && styles.freqToggleActive]}
            onPress={handleFreqToggle}
            activeOpacity={0.8}
          >
            <Text style={[styles.freqToggleText, freqEnabled && { color: activeRange.color }]}>
              {freqEnabled ? 'On' : 'Off'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Day 63 — Band display */}
        <FrequencyBandDisplay hz={frequency} />

        {/* Day 63 — Logarithmic slider */}
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Frequency</Text>
            <Text style={[styles.sliderValue, { color: activeRange.color }]}>{frequency} Hz</Text>
          </View>
          <CustomSlider
            label=""
            value={sliderPos}
            onChange={handleSliderChange}
            onSlidingComplete={handleSliderComplete}
            minimumValue={0}
            maximumValue={100}
            step={1}
            unit=""
          />
          <Text style={styles.sliderHint}>
            Drag to explore · Snaps to nearest healing frequency
          </Text>
        </View>

        <View style={styles.sliderDivider} />

        {/* Intensity */}
        <View style={styles.sliderBlock}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Intensity</Text>
            <Text style={styles.sliderValue}>{freqIntensity}%</Text>
          </View>
          <CustomSlider label="" value={freqIntensity} onChange={handleFreqIntensityChange} minimumValue={0} maximumValue={100} step={1} unit="%" />
          <Text style={styles.sliderHint}>Blends the healing tone with the audio session</Text>
        </View>

        {/* Range chips */}
        <View style={styles.presetRow}>
          {FREQUENCY_RANGES.map((range) => {
            const active = activeRange.id === range.id;
            return (
              <TouchableOpacity
                key={range.id}
                style={[styles.freqChip, active && { backgroundColor: `${range.color}18`, borderColor: `${range.color}50` }]}
                onPress={() => handleRangeChip(range.id)}
                activeOpacity={0.75}
              >
                <Text style={[styles.freqChipText, active && { color: range.color }]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Text style={styles.footer}>Sound Energy Therapy</Text>
      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

/* ── STYLES ── */
const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: C.bg, paddingHorizontal: 28, paddingTop: 24 },

  glowTop:    { position: 'absolute', top: -100, alignSelf: 'center', width: 320, height: 320, borderRadius: 999, backgroundColor: C.glowGold },
  glowBottom: { position: 'absolute', bottom: 0,  alignSelf: 'center', width: 240, height: 240, borderRadius: 999, backgroundColor: C.glowPurple },
  ringOuter:  { position: 'absolute', top: 108, alignSelf: 'center', width: 300, height: 300, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(212,168,40,0.10)' },
  ringMid:    { position: 'absolute', top: 142, alignSelf: 'center', width: 232, height: 232, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(212,168,40,0.16)' },
  ringInner:  { position: 'absolute', top: 176, alignSelf: 'center', width: 164, height: 164, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(212,168,40,0.24)' },
  topBar:     { position: 'absolute', top: 55, left: 18, zIndex: 10 },

  playlistIndicator: { marginTop: 60, alignItems: 'center', gap: 8, marginBottom: -8 },
  playlistText:      { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: C.textDim },
  playlistDots:      { flexDirection: 'row', gap: 5 },
  playlistDot:       { width: 4, height: 4, borderRadius: 999, backgroundColor: C.textDim },
  playlistDotActive: { backgroundColor: C.goldBright, width: 12 },

  artworkWrap:    { marginTop: 52, marginBottom: 28, alignItems: 'center', justifyContent: 'center', position: 'relative', width: 160, height: 160 },
  artwork:        { width: 120, height: 120, borderRadius: 999, backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderGold, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artworkPlaying: { borderColor: C.goldBright, borderWidth: 1.5 },
  artworkGlow:    { position: 'absolute', width: 80, height: 80, borderRadius: 999, backgroundColor: 'rgba(212,168,40,0.08)' },
  artworkSymbol:  { fontSize: 46, color: C.goldBright },
  freqRing:       { position: 'absolute', width: 140, height: 140, borderRadius: 999, borderWidth: 1.5, opacity: 0.6 },

  bassBar:  { position: 'absolute', width: 3, borderRadius: 99, backgroundColor: C.goldBright, opacity: 0.5 },
  bassBarL: { left: 6,  top: '50%' },
  bassBarR: { right: 6, top: '50%' },
  bassBarLi:{ left: 18, top: '50%' },
  bassBarRi:{ right: 18, top: '50%' },

  trackInfo:       { alignItems: 'center', marginBottom: 24, paddingHorizontal: 12 },
  trackLabel:      { fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: C.textMuted, fontWeight: '400', marginBottom: 10 },
  trackTitle:      { fontSize: 28, fontWeight: '300', color: C.textBright, textAlign: 'center', letterSpacing: 0.3, marginBottom: 8 },
  trackDesc:       { fontSize: 13, color: C.textMid, textAlign: 'center', fontWeight: '300', lineHeight: 20, marginBottom: 8 },
  freqActiveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  freqActiveDot:   { width: 5, height: 5, borderRadius: 999 },
  freqActiveText:  { fontSize: 10, letterSpacing: 2, fontWeight: '500' },

  progressWrap:  { width: '100%', maxWidth: 340, marginBottom: 28 },
  progressTrack: { height: 3, backgroundColor: C.bgCardDeep, borderRadius: 999, overflow: 'visible', position: 'relative' },
  progressFill:  { height: '100%', backgroundColor: C.goldBright, borderRadius: 999 },
  progressHead:  { position: 'absolute', top: -4, marginLeft: -5, width: 11, height: 11, borderRadius: 999, backgroundColor: C.goldBright, shadowColor: C.goldBright, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 },
  timeRow:       { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  timeText:      { fontSize: 11, color: C.textMuted, letterSpacing: 0.5 },

  transport:        { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 },
  skipBtn:          { width: 48, height: 48, borderRadius: 999, backgroundColor: C.bgCardDeep, borderWidth: 1, borderColor: C.borderGold, alignItems: 'center', justifyContent: 'center' },
  skipBtnDisabled:  { opacity: 0.3 },
  skipIcon:         { fontSize: 18, color: C.goldBright },
  skipIconDisabled: { color: C.textDim },
  playBtn:          { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.goldBright, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 999, shadowColor: C.goldBright, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  playBtnDisabled:  { opacity: 0.5 },
  playBtnIcon:      { fontSize: 15, color: C.bg, fontWeight: '800' },
  playBtnText:      { fontSize: 13, fontWeight: '700', color: C.bg, letterSpacing: 3, textTransform: 'uppercase' },

  controlsRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  ctrlPill:           { backgroundColor: C.bgCardDeep, borderWidth: 1, borderColor: C.borderPurple, borderRadius: 99, paddingVertical: 10, paddingHorizontal: 22 },
  ctrlPillActive:     { backgroundColor: 'rgba(212,168,40,0.08)', borderColor: C.borderGold },
  ctrlPillText:       { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.textDim, fontWeight: '500' },
  ctrlPillTextActive: { color: C.goldBright },

  controlsCard:  { width: '100%', maxWidth: 340, backgroundColor: C.bgCardDeep, borderRadius: 20, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden', marginBottom: 12 },
  sliderBlock:   { padding: 18 },
  sliderDivider: { height: 1, backgroundColor: C.borderGold },
  sliderHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sliderLabel:   { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontWeight: '400' },
  sliderValue:   { fontSize: 13, color: C.goldBright, fontWeight: '600', letterSpacing: 1 },
  sliderHint:    { fontSize: 11, color: C.textDim, fontWeight: '300', lineHeight: 16, marginTop: 6 },

  bassCard:       { width: '100%', maxWidth: 340, backgroundColor: C.bgCardDeep, borderRadius: 20, borderWidth: 1, borderColor: C.borderGold, overflow: 'hidden', marginBottom: 12 },
  bassCardBar:    { height: 2, backgroundColor: C.goldBright, opacity: 0.5 },
  bassCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12 },
  bassCardTitle:  { fontSize: 14, fontWeight: '700', color: C.textBright },
  bassCardValue:  { fontSize: 20, fontWeight: '700', color: C.goldBright, letterSpacing: 0.3 },
  bassHint:       { fontSize: 11, color: C.textDim, fontWeight: '300', paddingHorizontal: 18, marginBottom: 8, lineHeight: 16 },
  bassRateHint:   { fontSize: 11, color: C.textDim, fontWeight: '300', lineHeight: 16, marginTop: 6 },

  presetRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 18, paddingBottom: 4 },
  presetChip:           { backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderPurple, borderRadius: 99, paddingVertical: 7, paddingHorizontal: 14 },
  presetChipActive:     { backgroundColor: 'rgba(212,168,40,0.10)', borderColor: C.borderGold },
  presetChipText:       { fontSize: 11, color: C.textDim, fontWeight: '500', letterSpacing: 0.5 },
  presetChipTextActive: { color: C.goldBright },

  freqCard:             { width: '100%', maxWidth: 340, backgroundColor: C.bgCardDeep, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(126,255,212,0.15)', overflow: 'hidden', marginBottom: 24 },
  freqCardBar:          { height: 2, opacity: 0.6 },
  freqCardHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, paddingBottom: 12 },
  freqCardTitle:        { fontSize: 14, fontWeight: '700', color: C.textBright },
  freqToggle:           { backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderPurple, borderRadius: 99, paddingVertical: 7, paddingHorizontal: 16 },
  freqToggleActive:     { backgroundColor: 'rgba(126,255,212,0.10)', borderColor: 'rgba(126,255,212,0.3)' },
  freqToggleText:       { fontSize: 11, color: C.textDim, fontWeight: '600', letterSpacing: 1 },
  freqChip:             { backgroundColor: C.bgHero, borderWidth: 1, borderColor: C.borderPurple, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 12 },
  freqChipText:         { fontSize: 10, color: C.textDim, fontWeight: '500', letterSpacing: 1 },

  footer: { fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: C.textMuted, fontWeight: '300' },
});