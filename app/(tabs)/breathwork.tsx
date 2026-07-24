// =======================================
// SCREEN: Breathwork (app/(tabs)/breathwork.tsx)
// Day 89 — Guided breathing techniques with animated timer
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { useEffect, useRef, useState } from 'react';
import { GOLD, goldAlpha } from '@/constants/Colors';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#0A0616',
  bgCard:       '#1A0D2E',
  bgCardDeep:   '#160A28',
  bgHero:       '#1E0A3C',

  goldBright:   GOLD,
  goldMid:      GOLD,

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   goldAlpha(0.15),
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.15)',
};

const SCALE_EXPAND   = 1.40;
const SCALE_CONTRACT = 0.72;
const CIRCLE_SIZE    = 180;

/* ---------------------------------------
   SECTION B — Types & Data
---------------------------------------- */
type ScaleTarget = 'expand' | 'contract';

type Phase = {
  label: string;
  duration: number;
  scale: ScaleTarget;
};

type Technique = {
  id: string;
  name: string;
  subtitle: string;
  phaseText: string;
  accentColor: string;
  phases: Phase[];
};

const TECHNIQUES: Technique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    subtitle: 'Nervous System Reset',
    phaseText: '4s inhale · 4s hold · 4s exhale · 4s hold',
    accentColor: GOLD,
    phases: [
      { label: 'Inhale', duration: 4, scale: 'expand'   },
      { label: 'Hold',   duration: 4, scale: 'expand'   },
      { label: 'Exhale', duration: 4, scale: 'contract' },
      { label: 'Hold',   duration: 4, scale: 'contract' },
    ],
  },
  {
    id: 'belly',
    name: 'Belly Breathing',
    subtitle: 'Deep Diaphragmatic · Grounding',
    phaseText: '5s inhale · 2s hold · 7s exhale',
    accentColor: '#27AE60',
    phases: [
      { label: 'Inhale', duration: 5, scale: 'expand'   },
      { label: 'Hold',   duration: 2, scale: 'expand'   },
      { label: 'Exhale', duration: 7, scale: 'contract' },
    ],
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    subtitle: 'Anxiety Relief · Sleep',
    phaseText: '4s inhale · 7s hold · 8s exhale',
    accentColor: '#3498DB',
    phases: [
      { label: 'Inhale', duration: 4, scale: 'expand'   },
      { label: 'Hold',   duration: 7, scale: 'expand'   },
      { label: 'Exhale', duration: 8, scale: 'contract' },
    ],
  },
  {
    id: 'holotropic',
    name: 'Holotropic',
    subtitle: 'Trauma Release · Deep Healing',
    phaseText: 'Continuous connected breath',
    accentColor: '#E84393',
    phases: [
      { label: 'Breathe In',  duration: 2, scale: 'expand'   },
      { label: 'Breathe Out', duration: 2, scale: 'contract' },
    ],
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof',
    subtitle: 'Energy · Immune Boost',
    phaseText: '30 power breaths · retention hold',
    accentColor: '#E67E22',
    phases: [
      { label: 'Inhale', duration: 2,  scale: 'expand'   },
      { label: 'Exhale', duration: 1,  scale: 'contract' },
      { label: 'Hold',   duration: 20, scale: 'contract' },
    ],
  },
  {
    id: 'coherence',
    name: 'Coherence Breathing',
    subtitle: 'Heart Rate Variability',
    phaseText: '5s inhale · 5s exhale',
    accentColor: '#7B3FA0',
    phases: [
      { label: 'Inhale', duration: 5, scale: 'expand'   },
      { label: 'Exhale', duration: 5, scale: 'contract' },
    ],
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril',
    subtitle: 'Balance · Clarity',
    phaseText: '4s inhale · 4s hold · 4s exhale',
    accentColor: '#16A085',
    phases: [
      { label: 'Inhale', duration: 4, scale: 'expand'   },
      { label: 'Hold',   duration: 4, scale: 'expand'   },
      { label: 'Exhale', duration: 4, scale: 'contract' },
    ],
  },
];

/* ---------------------------------------
   SECTION C — Technique Card
---------------------------------------- */
function TechniqueCard({
  technique,
  onPress,
}: {
  technique: Technique;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={styles.card}>
      <View style={[styles.cardAccentBar, { backgroundColor: technique.accentColor }]} />
      <View style={styles.cardBody}>
        <View style={[styles.accentDot, { backgroundColor: technique.accentColor }]} />
        <View style={styles.cardTextBlock}>
          <Text style={styles.cardName}>{technique.name}</Text>
          <Text style={styles.cardSubtitle}>{technique.subtitle}</Text>
          <View style={styles.phaseRow}>
            <Text style={[styles.phaseText, { color: technique.accentColor }]}>
              {technique.phaseText}
            </Text>
          </View>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------------------------------
   SECTION D — Breathing Timer
---------------------------------------- */
function BreathingTimer({
  technique,
  onBack,
}: {
  technique: Technique;
  onBack: () => void;
}) {
  const [isRunning,  setIsRunning]  = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown,  setCountdown]  = useState(technique.phases[0].duration);

  const circleScale = useRef(new Animated.Value(SCALE_CONTRACT)).current;

  // Reset everything when technique changes (shouldn't happen but guard anyway)
  useEffect(() => {
    setIsRunning(false);
    setPhaseIndex(0);
    setCountdown(technique.phases[0].duration);
    circleScale.setValue(SCALE_CONTRACT);
  }, [technique.id]);

  // Phase engine — runs whenever isRunning or phaseIndex changes
  useEffect(() => {
    if (!isRunning) return;

    const phase = technique.phases[phaseIndex];
    const toValue = phase.scale === 'expand' ? SCALE_EXPAND : SCALE_CONTRACT;

    setCountdown(phase.duration);

    const anim = Animated.timing(circleScale, {
      toValue,
      duration: phase.duration * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });
    anim.start();

    // Tick down every second
    let remaining = phase.duration;
    const interval = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
    }, 1000);

    // Advance to next phase when duration elapses
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPhaseIndex((i) => (i + 1) % technique.phases.length);
    }, phase.duration * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      anim.stop();
    };
  }, [isRunning, phaseIndex]);

  const currentPhase = technique.phases[phaseIndex];

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
      setPhaseIndex(0);
      setCountdown(technique.phases[0].duration);
      circleScale.setValue(SCALE_CONTRACT);
    } else {
      setIsRunning(true);
    }
  };

  const glowColor = technique.accentColor + '28';
  const ringColor = technique.accentColor + 'AA';

  return (
    <View style={styles.timerRoot}>
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={styles.timerBack} activeOpacity={0.7}>
        <Text style={styles.timerBackText}>← Back</Text>
      </TouchableOpacity>

      {/* Technique name */}
      <Text style={styles.timerEyebrow}>{technique.subtitle.toUpperCase()}</Text>
      <Text style={styles.timerName}>{technique.name}</Text>

      {/* Animated circle */}
      <View style={styles.circleWrapper}>
        {/* Static glow ring behind the circle */}
        <View
          style={[
            styles.circleGlowRing,
            { borderColor: technique.accentColor + '22', width: CIRCLE_SIZE + 60, height: CIRCLE_SIZE + 60, borderRadius: (CIRCLE_SIZE + 60) / 2 },
          ]}
        />
        <Animated.View
          style={[
            styles.circle,
            {
              borderColor:     ringColor,
              backgroundColor: glowColor,
              transform: [{ scale: circleScale }],
            },
          ]}
        />
      </View>

      {/* Phase label */}
      <Text style={[styles.phaseLabel, { color: technique.accentColor }]}>
        {currentPhase.label.toUpperCase()}
      </Text>

      {/* Countdown */}
      <Text style={styles.countdownNum}>
        {countdown > 0 ? countdown : currentPhase.duration}
      </Text>
      <Text style={styles.countdownSec}>seconds</Text>

      {/* Controls */}
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.85}
        style={[
          styles.startBtn,
          isRunning
            ? { borderColor: C.borderGold, backgroundColor: goldAlpha(0.08) }
            : { backgroundColor: technique.accentColor },
        ]}
      >
        <Text style={[styles.startBtnText, isRunning && { color: C.goldBright }]}>
          {isRunning ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------------------------------
   SECTION E — Screen Component
---------------------------------------- */
export default function BreathworkScreen() {
  const { isTabletLandscape, isTabletPortrait } = useResponsive();

  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);

  const handleSelect = (technique: Technique) => {
    setSelectedTechnique(technique);
  };

  const handleBack = () => {
    setSelectedTechnique(null);
  };

  // Timer view — full screen within the tab
  if (selectedTechnique) {
    return (
      <View style={styles.root}>
        <BreathingTimer technique={selectedTechnique} onBack={handleBack} />
      </View>
    );
  }

  // List view
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isTabletLandscape && styles.containerTabletLandscape,
        isTabletPortrait  && styles.containerTabletPortrait,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient glows */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowMidLeft} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Pranayama & Practice</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>
          Breathwork
        </Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Conscious breathing to regulate, heal, and expand
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* Section label */}
      <View style={styles.sectionLabelRow}>
        <View style={styles.sectionLabelLine} />
        <Text style={styles.sectionLabelText}>Techniques</Text>
        <View style={styles.sectionLabelLine} />
      </View>

      {/* Cards */}
      <View style={isTabletLandscape ? styles.gridTablet : styles.list}>
        {TECHNIQUES.map((technique) => (
          <View
            key={technique.id}
            style={isTabletLandscape ? styles.gridItem : undefined}
          >
            <TechniqueCard technique={technique} onPress={() => handleSelect(technique)} />
          </View>
        ))}
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

/* ---------------------------------------
   STYLES
---------------------------------------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── List screen ──
  container: {
    paddingTop: 68,
    paddingHorizontal: 22,
    backgroundColor: C.bg,
  },
  containerTabletLandscape: { paddingHorizontal: 40 },
  containerTabletPortrait:  { paddingHorizontal: 60 },

  glowTopRight: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: C.glowGold,
  },
  glowMidLeft: {
    position: 'absolute',
    top: 500,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: C.glowPurple,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '400',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  titleTabletP: { fontSize: 44 },
  subtitle: {
    fontSize: 13,
    color: C.textMid,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 20,
  },
  subtitleTabletP: { fontSize: 15 },

  goldRule: {
    height: 1,
    backgroundColor: C.borderGold,
    marginVertical: 20,
    marginHorizontal: 20,
  },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  sectionLabelText: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: C.textMuted,
    fontWeight: '400',
  },

  list: { gap: 12 },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: { width: '48%' },

  // ── Card ──
  card: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  cardAccentBar: {
    height: 3,
    opacity: 0.85,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 3,
    flexShrink: 0,
  },
  cardTextBlock: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '300',
  },
  phaseRow: {
    marginTop: 6,
  },
  phaseText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  cardArrow: {
    fontSize: 22,
    color: C.textDim,
    fontWeight: '300',
    flexShrink: 0,
  },

  // ── Timer view ──
  timerRoot: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 68,
    paddingBottom: 80,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  timerBack: {
    position: 'absolute',
    top: 68,
    left: 22,
  },
  timerBackText: {
    fontSize: 14,
    color: C.textMuted,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  timerEyebrow: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '400',
    marginBottom: 6,
    textAlign: 'center',
  },
  timerName: {
    fontSize: 24,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: -0.3,
    marginBottom: 48,
    textAlign: 'center',
  },

  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: CIRCLE_SIZE + 80,
    height: CIRCLE_SIZE + 80,
  },
  circleGlowRing: {
    position: 'absolute',
    borderWidth: 1,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
  },

  phaseLabel: {
    fontSize: 11,
    letterSpacing: 5,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  countdownNum: {
    fontSize: 64,
    fontWeight: '200',
    color: C.textBright,
    lineHeight: 72,
  },
  countdownSec: {
    fontSize: 11,
    color: C.textDim,
    letterSpacing: 3,
    fontWeight: '300',
    marginBottom: 48,
  },

  startBtn: {
    borderRadius: 99,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  startBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: C.bg,
  },
});
