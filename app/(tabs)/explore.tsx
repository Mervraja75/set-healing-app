// =======================================
// SCREEN: Explore (app/(tabs)/explore.tsx)
// Day 91 — Grid hub for all content areas
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

import { useResponsive } from '@/hooks/useResponsive';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#120828',
  bgCard:       '#1E0A30',
  bgCardDeep:   '#250D3D',

  goldBright:   '#D4A828',
  goldMid:      '#C8920A',

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   'rgba(212, 168, 40, 0.18)',
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     'rgba(212, 168, 40, 0.08)',
  glowPurple:   'rgba(100, 50, 180, 0.15)',
};

/* ---------------------------------------
   SECTION B — Grid data
---------------------------------------- */
type ExploreItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
};

const ITEMS: ExploreItem[] = [
  {
    id: 'meditations',
    title: 'Meditations',
    description: 'Guided journeys for deep healing and expanded awareness',
    icon: '◈',
    color: '#7B3FA0',
    route: '/(tabs)/meditations',
  },
  {
    id: 'breathwork',
    title: 'Breathwork',
    description: 'Conscious breathing techniques to regulate and restore',
    icon: '◎',
    color: '#3498DB',
    route: '/(tabs)/breathwork',
  },
  {
    id: 'chakras',
    title: 'Chakras',
    description: 'Seven sacred energy centers with frequency sessions',
    icon: '◉',
    color: '#9B59B6',
    route: '/(tabs)/chakras',
  },
  {
    id: 'affirmations',
    title: 'Affirmations',
    description: 'Sacred words that rewire the mind and open the heart',
    icon: '❝',
    color: '#C9A84C',
    route: '/(tabs)/affirmations',
  },
  {
    id: 'frequencies',
    title: 'Frequencies',
    description: 'Binaural and vibroacoustic healing sound sessions',
    icon: '◐',
    color: '#D4A828',
    route: '/(tabs)/healing',
  },
  {
    id: 'categories',
    title: 'Categories',
    description: 'Browse all healing collections by sound and intention',
    icon: '◫',
    color: '#27AE60',
    route: '/categories',
  },
];

/* ---------------------------------------
   SECTION C — Grid Card
---------------------------------------- */
function ExploreCard({ item }: { item: ExploreItem }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={() => router.push(item.route as any)}
      style={styles.card}
    >
      {/* Top accent strip */}
      <View style={[styles.cardStrip, { backgroundColor: item.color }]} />

      <View style={styles.cardContent}>
        {/* Icon */}
        <View style={[styles.iconWrap, { backgroundColor: item.color + '18', borderColor: item.color + '44' }]}>
          <Text style={[styles.iconText, { color: item.color }]}>{item.icon}</Text>
        </View>

        {/* Text */}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>

        {/* Arrow */}
        <View style={styles.cardFooter}>
          <Text style={[styles.cardArrow, { color: item.color }]}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------------------------------
   SECTION D — Screen Component
---------------------------------------- */
export default function ExploreScreen() {
  const { isTabletLandscape, isTabletPortrait } = useResponsive();

  const cardWidth = isTabletLandscape ? '31.5%' : '48.5%';

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
        <Text style={styles.eyebrow}>All Practices</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>
          Explore
        </Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Every tool for your healing journey, in one place
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* Section label */}
      <View style={styles.sectionLabelRow}>
        <View style={styles.sectionLabelLine} />
        <Text style={styles.sectionLabelText}>Practices</Text>
        <View style={styles.sectionLabelLine} />
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {ITEMS.map((item) => (
          <View key={item.id} style={{ width: cardWidth }}>
            <ExploreCard item={item} />
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
    top: 400,
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

  // ── Grid ──
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // ── Card ──
  card: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
    minHeight: 180,
  },
  cardStrip: {
    height: 3,
    opacity: 0.85,
  },
  cardContent: {
    flex: 1,
    padding: 18,
    gap: 8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconText: {
    fontSize: 22,
    lineHeight: 26,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  cardDesc: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '300',
    lineHeight: 17,
    flex: 1,
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  cardArrow: {
    fontSize: 16,
    fontWeight: '500',
  },
});
