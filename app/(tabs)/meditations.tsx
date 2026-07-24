// =======================================
// SCREEN: Meditations (app/(tabs)/meditations.tsx)
// Day 88 — Guided meditation session list
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link, useRouter } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
import {
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

/* ---------------------------------------
   SECTION B — Types & Data
---------------------------------------- */
type MeditationSession = {
  id: string;
  title: string;
  duration: string;
  description: string;
  accentColor: string;
  sound: string;
};

const SESSIONS: MeditationSession[] = [
  {
    id: 'nervous-system-reset',
    title: 'Nervous System Reset',
    duration: '20 min',
    description: 'Deep vibroacoustic journey to regulate and restore your nervous system',
    accentColor: '#7B3FA0',
    sound: 'calm',
  },
  {
    id: 'sacred-feminine-activation',
    title: 'Sacred Feminine Activation',
    duration: '18 min',
    description: 'A return to the body and ancient knowing',
    accentColor: '#E84393',
    sound: 'energy',
  },
  {
    id: 'ancestral-healing-journey',
    title: 'Ancestral Healing Journey',
    duration: '20 min',
    description: 'A descent into roots and blood memory',
    accentColor: '#C0392B',
    sound: 'calm',
  },
  {
    id: 'heart-opening',
    title: 'Heart Opening',
    duration: '15 min',
    description: 'Dissolving the walls around the heart',
    accentColor: '#E84393',
    sound: 'calm',
  },
  {
    id: 'deep-sleep-induction',
    title: 'Deep Sleep Induction',
    duration: '25 min',
    description: 'Delta wave journey into restorative sleep',
    accentColor: '#2C3E50',
    sound: 'sleep',
  },
  {
    id: 'inner-child-healing',
    title: 'Inner Child Healing',
    duration: '22 min',
    description: 'Meeting the younger self with compassion',
    accentColor: '#3498DB',
    sound: 'calm',
  },
  {
    id: 'manifestation-journey',
    title: 'Manifestation Journey',
    duration: '18 min',
    description: 'Theta state visualization for creation',
    accentColor: GOLD,
    sound: 'focus',
  },
];

/* ---------------------------------------
   SECTION C — Sub-components
---------------------------------------- */
function SectionLabel({ title }: { title: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelLine} />
      <Text style={styles.sectionLabelText}>{title}</Text>
      <View style={styles.sectionLabelLine} />
    </View>
  );
}

function SessionCard({ session }: { session: MeditationSession }) {
  return (
    <Link
      href={{
        pathname: '/test',
        params: {
          title: session.title,
          description: session.description,
          sound: session.sound,
        },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.78} style={styles.card}>
        {/* Colored top accent bar */}
        <View style={[styles.cardAccentBar, { backgroundColor: session.accentColor }]} />

        <View style={styles.cardBody}>
          {/* Left: accent dot + text */}
          <View style={styles.cardLeft}>
            <View style={[styles.accentDot, { backgroundColor: session.accentColor }]} />
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>{session.title}</Text>
              <Text style={styles.cardDescription}>{session.description}</Text>
            </View>
          </View>

          {/* Right: duration badge + arrow */}
          <View style={styles.cardRight}>
            <View style={[styles.durationBadge, { borderColor: session.accentColor + '55' }]}>
              <Text style={[styles.durationText, { color: session.accentColor }]}>
                {session.duration}
              </Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

/* ---------------------------------------
   SECTION D — Screen Component
---------------------------------------- */
export default function MeditationsScreen() {
  const router = useRouter();
  const { isTabletLandscape, isTabletPortrait } = useResponsive();

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

      {/* ── Back button ── */}
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Guided Journeys</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>
          Meditations
        </Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Sacred guided sessions to heal, restore, and expand
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* ── Session list ── */}
      <SectionLabel title="All Sessions" />

      <View style={isTabletLandscape ? styles.gridTablet : styles.list}>
        {SESSIONS.map((session) => (
          <View
            key={session.id}
            style={isTabletLandscape ? styles.gridItem : undefined}
          >
            <SessionCard session={session} />
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
  container: {
    paddingTop: 68,
    paddingHorizontal: 22,
    backgroundColor: C.bg,
  },
  containerTabletLandscape: { paddingHorizontal: 40 },
  containerTabletPortrait:  { paddingHorizontal: 60 },

  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    fontSize: 15,
    color: C.textMuted,
    fontWeight: '400',
    letterSpacing: 0.3,
  },

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

  list: {
    gap: 12,
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },

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
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 5,
    flexShrink: 0,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 18,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
  },
  durationBadge: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardArrow: {
    fontSize: 22,
    color: C.textDim,
    fontWeight: '300',
  },
});
