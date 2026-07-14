// =======================================
// SCREEN: Explore (app/(tabs)/explore.tsx)
// Day 95 — Fixed 2-column square-card grid
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
  useWindowDimensions,
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
    description: 'Guided journeys for deep healing',
    icon: '◈',
    color: '#7B3FA0',
    route: '/(tabs)/meditations',
  },
  {
    id: 'breathwork',
    title: 'Breathwork',
    description: 'Conscious breathing to regulate and restore',
    icon: '◎',
    color: '#3498DB',
    route: '/(tabs)/breathwork',
  },
  {
    id: 'chakras',
    title: 'Chakras',
    description: 'Seven energy centers with frequency sessions',
    icon: '◉',
    color: '#9B59B6',
    route: '/(tabs)/chakras',
  },
  {
    id: 'affirmations',
    title: 'Affirmations',
    description: 'Sacred words that rewire mind and heart',
    icon: '❝',
    color: '#C9A84C',
    route: '/(tabs)/affirmations',
  },
  {
    id: 'frequencies',
    title: 'Frequencies',
    description: 'Binaural and vibroacoustic sound sessions',
    icon: '◐',
    color: '#C9A84C',
    route: '/(tabs)/healing',
  },
  {
    id: 'healing-music',
    title: 'Healing Music',
    description: 'Original compositions for restoration',
    icon: '♪',
    color: '#E84393',
    route: '/(tabs)/healing-music',
  },
  {
    id: 'elements',
    title: 'Elements',
    description: 'Five sacred forces of earth, water, fire, air and ether',
    icon: '◆',
    color: '#16A085',
    route: '/(tabs)/elements',
  },
  {
    id: 'categories',
    title: 'Categories',
    description: 'Browse all collections by intention',
    icon: '◫',
    color: '#27AE60',
    route: '/categories',
  },
];

/* ---------------------------------------
   SECTION C — Grid Card
   size: exact pixel dimension (width = height)
---------------------------------------- */
function ExploreCard({ item, size }: { item: ExploreItem; size: number }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={() => router.push(item.route as any)}
      style={[styles.card, { width: size, height: size }]}
    >
      {/* Colored top accent strip */}
      <View style={[styles.cardStrip, { backgroundColor: item.color }]} />

      {/* Card body — icon top, text/arrow bottom */}
      <View style={styles.cardContent}>

        {/* Icon */}
        <View style={[
          styles.iconWrap,
          { backgroundColor: item.color + '18', borderColor: item.color + '44' },
        ]}>
          <Text style={[styles.iconText, { color: item.color }]}>{item.icon}</Text>
        </View>

        {/* Bottom group */}
        <View>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={[styles.cardArrow, { color: item.color }]}>→</Text>
          </View>
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
  const { width: screenWidth } = useWindowDimensions();

  // Exact pixel card size: avoids the percentage + gap overflow bug in RN flex-wrap.
  // Cards are square — same value used for both width and height.
  const numCols  = isTabletLandscape ? 3 : 2;
  const hPad     = isTabletLandscape ? 40 : isTabletPortrait ? 60 : 22;
  const colGap   = 12;
  const cardSize = Math.floor(
    (screenWidth - hPad * 2 - colGap * (numCols - 1)) / numCols
  );

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

      {/* Grid — pixel-sized cards eliminate the percentage + gap overflow */}
      <View style={styles.grid}>
        {ITEMS.map((item) => (
          <ExploreCard key={item.id} item={item} size={cardSize} />
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
  // gap: 12 works correctly here because children have explicit pixel widths,
  // not percentages — so the gap never causes overflow-wrap.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // ── Card ──
  // width + height injected as inline style from cardSize calculation
  card: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  cardStrip: {
    height: 3,
    opacity: 0.85,
  },
  // space-between pushes icon to top and text group to bottom
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: '300',
    lineHeight: 15,
    marginBottom: 4,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  cardArrow: {
    fontSize: 14,
    fontWeight: '600',
  },
});
