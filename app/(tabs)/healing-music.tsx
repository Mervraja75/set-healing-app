// =======================================
// SCREEN: Healing Music (app/(tabs)/healing-music.tsx)
// Day 1 (Demo Sprint) — Original SET Healing compositions
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { usePlayer } from '@/context/PlayerContext';
import { useResponsive } from '@/hooks/useResponsive';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#0A0616',
  bgCard:       '#1A0D2E',
  bgCardDeep:   '#160A28',

  goldBright:   '#C9A84C',
  goldMid:      '#C8920A',

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   'rgba(201, 168, 76, 0.15)',
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     'rgba(201, 168, 76, 0.08)',
  glowPurple:   'rgba(100, 50, 180, 0.15)',
};

/* ---------------------------------------
   SECTION B — Types & Data
---------------------------------------- */
type Composition = {
  id: string;
  title: string;
  description: string;
  duration: string;
  accentColor: string;
  sound: string;
};

const COMPOSITIONS: Composition[] = [
  {
    id: 'crystal-bowl-meditation',
    title: 'Crystal Bowl Meditation',
    description: '432 Hz Tuned',
    duration: '18 min',
    accentColor: '#7B3FA0',
    sound: 'calm',
  },
  {
    id: 'solfeggio-symphony',
    title: 'Solfeggio Symphony',
    description: '528 Hz Love Frequency',
    duration: '22 min',
    accentColor: '#C9A84C',
    sound: 'focus',
  },
  {
    id: 'deep-earth-resonance',
    title: 'Deep Earth Resonance',
    description: 'Grounding Bass Tones',
    duration: '30 min',
    accentColor: '#16A085',
    sound: 'calm',
  },
  {
    id: 'celestial-harmonics',
    title: 'Celestial Harmonics',
    description: 'High Frequency Light Codes',
    duration: '25 min',
    accentColor: '#3498DB',
    sound: 'energy',
  },
  {
    id: 'heart-field-activation',
    title: 'Heart Field Activation',
    description: '639 Hz Heart Coherence',
    duration: '20 min',
    accentColor: '#E84393',
    sound: 'calm',
  },
  {
    id: 'dream-weaver',
    title: 'Dream Weaver',
    description: 'Delta Wave Sleep Music',
    duration: '45 min',
    accentColor: '#2C3E50',
    sound: 'sleep',
  },
  {
    id: 'sacred-morning',
    title: 'Sacred Morning',
    description: 'Theta Wave Awakening',
    duration: '15 min',
    accentColor: '#F1C40F',
    sound: 'energy',
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

function CompositionCard({
  composition,
  onPress,
}: {
  composition: Composition;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.78} style={styles.card} onPress={onPress}>
      {/* Colored left accent bar */}
      <View style={[styles.cardAccentBar, { backgroundColor: composition.accentColor }]} />

      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle}>{composition.title}</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>{composition.description}</Text>

        <View style={styles.cardBottomRow}>
          <View style={[styles.durationBadge, { borderColor: composition.accentColor + '55' }]}>
            <Text style={[styles.durationText, { color: composition.accentColor }]}>
              {composition.duration}
            </Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------------------------------
   SECTION D — Screen Component
---------------------------------------- */
export default function HealingMusicScreen() {
  const router = useRouter();
  const { setPlaylist } = usePlayer();
  const { isTabletLandscape, isTabletPortrait } = useResponsive();

  const playComposition = (index: number) => {
    const tracks = COMPOSITIONS.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      sound: c.sound,
    }));
    setPlaylist(tracks, index);
    router.push('/test');
  };

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
        <Text style={styles.eyebrow}>Original Compositions</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>
          Healing Music
        </Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Sacred soundscapes composed to restore, ground, and awaken
        </Text>
      </View>

      {/* ── Header note ── */}
      <View style={styles.noteBox}>
        <Text style={styles.noteIcon}>♪</Text>
        <Text style={styles.noteText}>
          Original compositions by SET Healing — new music added regularly
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* ── Composition list ── */}
      <SectionLabel title="All Compositions" />

      <View style={isTabletLandscape ? styles.gridTablet : styles.list}>
        {COMPOSITIONS.map((composition, index) => (
          <View
            key={composition.id}
            style={isTabletLandscape ? styles.gridItem : undefined}
          >
            <CompositionCard
              composition={composition}
              onPress={() => playComposition(index)}
            />
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

  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(201, 168, 76, 0.06)',
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  noteIcon: {
    fontSize: 15,
    color: C.goldBright,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: C.textMuted,
    fontStyle: 'italic',
    fontWeight: '300',
    lineHeight: 18,
  },

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
    flexDirection: 'row',
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  cardAccentBar: {
    width: 4,
    alignSelf: 'stretch',
    opacity: 0.85,
  },
  cardBody: {
    flex: 1,
    padding: 18,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  comingSoonBadge: {
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
    flexShrink: 0,
  },
  comingSoonText: {
    fontSize: 9,
    letterSpacing: 0.4,
    fontWeight: '500',
    color: C.textDim,
  },
  cardDescription: {
    fontSize: 12,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 18,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
