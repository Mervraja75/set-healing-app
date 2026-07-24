// =======================================
// SCREEN: Elements (app/(tabs)/elements.tsx)
// Day 1 (Demo Sprint) — Expandable elemental healing cards
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { useRouter } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
import { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePlayer } from '@/context/PlayerContext';
import { useResponsive } from '@/hooks/useResponsive';

// LayoutAnimation on Android requires this flag
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
type ElementData = {
  id: string;
  name: string;
  subtitle: string;
  hz: number;
  color: string;
  icon: 'mountain.2.fill' | 'drop.fill' | 'flame.fill' | 'wind' | 'sparkles';
  description: string;
  affirmation: string;
  sound: string;
};

const ELEMENTS: ElementData[] = [
  {
    id: 'earth',
    name: 'Earth',
    subtitle: 'Grounding & Stability',
    hz: 396,
    color: '#16A085',
    icon: 'mountain.2.fill',
    description: "Root into the earth's healing energy. Release fear and reconnect with your physical body and the natural world.",
    affirmation: 'I am grounded, stable and fully supported.',
    sound: 'calm',
  },
  {
    id: 'water',
    name: 'Water',
    subtitle: 'Flow & Emotional Healing',
    hz: 417,
    color: '#3498DB',
    icon: 'drop.fill',
    description: 'Flow with the healing power of water. Release emotional blockages and restore fluid movement in body and mind.',
    affirmation: 'I flow with ease and release what no longer serves me.',
    sound: 'calm',
  },
  {
    id: 'fire',
    name: 'Fire',
    subtitle: 'Transformation & Energy',
    hz: 528,
    color: '#E67E22',
    icon: 'flame.fill',
    description: 'Ignite your inner fire. Transform stagnant energy into passionate, purposeful action and creative power.',
    affirmation: 'I am a powerful force of transformation and light.',
    sound: 'energy',
  },
  {
    id: 'air',
    name: 'Air',
    subtitle: 'Clarity & Communication',
    hz: 741,
    color: '#8E44AD',
    icon: 'wind',
    description: 'Breathe in clarity and truth. Open your throat and mind to clear communication and inspired thinking.',
    affirmation: 'I speak my truth with clarity and confidence.',
    sound: 'focus',
  },
  {
    id: 'ether',
    name: 'Ether',
    subtitle: 'Spirit & Connection',
    hz: 963,
    color: '#9B59B6',
    icon: 'sparkles',
    description: 'Connect with the infinite field of consciousness. Transcend the physical and touch the divine essence within you.',
    affirmation: 'I am connected to all that is, was, and ever will be.',
    sound: 'sleep',
  },
];

/* ---------------------------------------
   SECTION C — Element Card Component
---------------------------------------- */
function ElementCard({
  element,
  isExpanded,
  onToggle,
  onPlay,
}: {
  element: ElementData;
  isExpanded: boolean;
  onToggle: () => void;
  onPlay: () => void;
}) {
  const glowBg  = element.color + '18';
  const ringCol = element.color + '55';

  return (
    <View style={[styles.card, isExpanded && { borderColor: element.color + '55' }]}>
      {/* Colored left rail */}
      <View style={[styles.cardRail, { backgroundColor: element.color }]} />

      <View style={styles.cardInner}>

        {/* ── Header row (always visible) ── */}
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={onToggle}
          style={styles.cardHeader}
        >
          {/* Large element icon */}
          <View style={[styles.iconWrap, { backgroundColor: glowBg, borderColor: ringCol }]}>
            <IconSymbol name={element.icon} size={26} color={element.color} />
          </View>

          {/* Name + meta */}
          <View style={styles.cardMeta}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.elementName}>{element.name}</Text>
              <Text style={styles.hzBadge}>{element.hz} Hz</Text>
            </View>
            <Text style={[styles.subtitleText, { color: element.color }]}>{element.subtitle}</Text>
          </View>

          {/* Expand chevron */}
          <Text style={[styles.chevron, isExpanded && styles.chevronUp]}>›</Text>
        </TouchableOpacity>

        {/* ── Expanded content ── */}
        {isExpanded && (
          <View style={styles.expandedBody}>
            <View style={[styles.expandedDivider, { backgroundColor: element.color + '40' }]} />

            <Text style={styles.descriptionText}>{element.description}</Text>

            <View style={styles.expandedSection}>
              <Text style={styles.expandedLabel}>Affirmation</Text>
              <Text style={[styles.affirmationText, { color: element.color }]}>
                "{element.affirmation}"
              </Text>
            </View>

            {/* Play button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onPlay}
              style={[styles.playBtn, { backgroundColor: element.color + '22', borderColor: element.color + '66' }]}
            >
              <Text style={[styles.playBtnIcon, { color: element.color }]}>▶</Text>
              <Text style={[styles.playBtnText, { color: element.color }]}>
                Play {element.hz} Hz Session
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

/* ---------------------------------------
   SECTION D — Screen Component
---------------------------------------- */
export default function ElementsScreen() {
  const router = useRouter();
  const { setPlaylist } = usePlayer();
  const { isTabletLandscape, isTabletPortrait } = useResponsive();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handlePlay = (element: ElementData) => {
    setPlaylist(
      [{
        id: element.id,
        title: `${element.name} · ${element.hz} Hz`,
        description: `A ${element.hz} Hz vibroacoustic journey through the ${element.name} element — ${element.subtitle}`,
        sound: element.sound,
      }],
      0
    );
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
        <Text style={styles.eyebrow}>Elemental Healing</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>
          Elements
        </Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Five sacred forces of nature — tap to explore
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* ── Section label ── */}
      <View style={styles.sectionLabelRow}>
        <View style={styles.sectionLabelLine} />
        <Text style={styles.sectionLabelText}>All 5 Elements</Text>
        <View style={styles.sectionLabelLine} />
      </View>

      {/* ── Element cards ── */}
      <View style={styles.cardList}>
        {ELEMENTS.map((element) => (
          <ElementCard
            key={element.id}
            element={element}
            isExpanded={expandedId === element.id}
            onToggle={() => handleToggle(element.id)}
            onPlay={() => handlePlay(element)}
          />
        ))}
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

/* ---------------------------------------
   SECTION E — Styles
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

  cardList: { gap: 10 },

  // ── Card shell ──
  card: {
    flexDirection: 'row',
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  cardRail: {
    width: 4,
    opacity: 0.8,
    flexShrink: 0,
  },
  cardInner: {
    flex: 1,
  },

  // ── Card header (always visible) ──
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMeta: {
    flex: 1,
    gap: 3,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  elementName: {
    fontSize: 17,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  hzBadge: {
    fontSize: 10,
    color: C.goldMid,
    fontWeight: '500',
    letterSpacing: 1,
    backgroundColor: goldAlpha(0.10),
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    overflow: 'hidden',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: C.textDim,
    fontWeight: '300',
    transform: [{ rotate: '90deg' }],
    flexShrink: 0,
  },
  chevronUp: {
    transform: [{ rotate: '-90deg' }],
  },

  // ── Expanded body ──
  expandedBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
  },
  expandedDivider: {
    height: 1,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 21,
  },
  expandedSection: {
    gap: 6,
  },
  expandedLabel: {
    fontSize: 9,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '500',
  },
  affirmationText: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 11,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  playBtnIcon: {
    fontSize: 10,
    fontWeight: '800',
  },
  playBtnText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
