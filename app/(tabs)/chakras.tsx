// =======================================
// SCREEN: Chakras (app/(tabs)/chakras.tsx)
// Day 90 — Expandable chakra cards with player navigation
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link } from 'expo-router';
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

/* ---------------------------------------
   SECTION B — Types & Data
---------------------------------------- */
type ChakraData = {
  id: string;
  number: number;
  name: string;
  sanskrit: string;
  hz: number;
  color: string;
  location: string;
  themes: string;
  affirmation: string;
  balanced: string;
  imbalanced: string;
  meditation: string;
  sound: string;
};

const CHAKRAS: ChakraData[] = [
  {
    id: 'root',
    number: 1,
    name: 'Root',
    sanskrit: 'Muladhara',
    hz: 396,
    color: '#C0392B',
    location: 'Base of spine',
    themes: 'Safety · Grounding',
    affirmation: 'I am safe. I am grounded. I am fully supported by the earth.',
    balanced: 'A sense of security, physical vitality, financial stability, and a deep feeling of belonging in the body and in the world.',
    imbalanced: 'Chronic fear, anxiety, financial stress, disconnection from the body, or feelings of not belonging anywhere.',
    meditation: 'Feel the weight of your body pressing into the earth. With each exhale, imagine roots extending from the base of your spine deep into the ground below you. Let the earth hold you completely.',
    sound: 'calm',
  },
  {
    id: 'sacral',
    number: 2,
    name: 'Sacral',
    sanskrit: 'Svadhisthana',
    hz: 417,
    color: '#E67E22',
    location: 'Lower abdomen',
    themes: 'Creativity · Pleasure',
    affirmation: 'I embrace pleasure and creative flow. My emotions move through me freely.',
    balanced: 'Creative expression, emotional fluidity, healthy sexuality, a capacity for joy, and genuine delight in life\'s sensory richness.',
    imbalanced: 'Emotional numbness or overwhelm, creative blocks, guilt around pleasure, rigidity, or a sense of life feeling joyless.',
    meditation: 'Place one hand on your lower belly. Feel warmth beginning to glow there. Let your breath move like a wave, dissolving any hardness you\'ve been holding. Your feelings are water — they can flow.',
    sound: 'energy',
  },
  {
    id: 'solar-plexus',
    number: 3,
    name: 'Solar Plexus',
    sanskrit: 'Manipura',
    hz: 528,
    color: '#F1C40F',
    location: 'Upper abdomen',
    themes: 'Power · Confidence',
    affirmation: 'I am powerful. I trust myself completely. My will is aligned with my highest purpose.',
    balanced: 'Confidence, healthy boundaries, the ability to take decisive action, self-discipline, and a clear sense of personal identity.',
    imbalanced: 'Low self-esteem, people-pleasing, indecisiveness, control issues, or a persistent feeling of powerlessness.',
    meditation: 'Place your hands over your solar plexus. With each inhale, feel a golden sun expanding there — warm, radiant, unwavering. You are the author of your own life. Feel that truth settle in.',
    sound: 'focus',
  },
  {
    id: 'heart',
    number: 4,
    name: 'Heart',
    sanskrit: 'Anahata',
    hz: 639,
    color: '#27AE60',
    location: 'Center of chest',
    themes: 'Love · Compassion',
    affirmation: 'I give and receive love freely. My heart is open, healed, and whole.',
    balanced: 'Compassion for self and others, the capacity to forgive, deep connection in relationships, and a felt sense of love as your natural state.',
    imbalanced: 'Grief, resentment, loneliness, difficulty trusting, codependency, or the sensation of a wall around the heart.',
    meditation: 'Breathe gently into the center of your chest. With each inhale, your heart space softens and widens. With each exhale, release anything you\'ve been carrying that isn\'t yours. Let your chest become spacious.',
    sound: 'calm',
  },
  {
    id: 'throat',
    number: 5,
    name: 'Throat',
    sanskrit: 'Vishuddha',
    hz: 741,
    color: '#3498DB',
    location: 'Throat',
    themes: 'Expression · Truth',
    affirmation: 'I speak my truth with clarity and compassion. My voice is worthy of being heard.',
    balanced: 'Authentic self-expression, the ability to listen deeply, clear and honest communication, and alignment between inner truth and outer words.',
    imbalanced: 'Fear of speaking, chronic throat tension, dishonesty (with self or others), or an inability to ask for what is needed.',
    meditation: 'Feel the soft space at your throat. Begin to hum at a low pitch, letting the vibration loosen what has been held there. Your words carry power. Let them rise from your deepest truth.',
    sound: 'focus',
  },
  {
    id: 'third-eye',
    number: 6,
    name: 'Third Eye',
    sanskrit: 'Ajna',
    hz: 852,
    color: '#8E44AD',
    location: 'Forehead',
    themes: 'Intuition · Vision',
    affirmation: 'I trust my inner knowing. I see beyond appearances into the deeper truth of things.',
    balanced: 'Strong intuition, vivid imagination, clear perception, the ability to hold paradox, and trust in the unseen intelligence of life.',
    imbalanced: 'Confusion, overthinking, disconnection from intuition, rigid black-and-white thinking, or ignoring inner guidance.',
    meditation: 'Soften the muscles around your eyes and brow. Draw your attention inward to the space behind your forehead. Let images and impressions arise without grasping. You are the witness. Simply observe.',
    sound: 'focus',
  },
  {
    id: 'crown',
    number: 7,
    name: 'Crown',
    sanskrit: 'Sahasrara',
    hz: 963,
    color: '#9B59B6',
    location: 'Top of head',
    themes: 'Consciousness · Unity',
    affirmation: 'I am connected to all that is. I am an expression of divine consciousness.',
    balanced: 'A sense of spiritual connection, inner peace, clarity of purpose, and the lived experience of being part of something vast and loving.',
    imbalanced: 'Spiritual disconnection, cynicism, existential despair, a sense of meaninglessness, or spiritual bypassing.',
    meditation: 'Imagine a luminous lotus blooming at the very crown of your head, its petals opening to receive infinite light from above. With each breath, this light fills your entire being. You are held by something larger than yourself.',
    sound: 'sleep',
  },
];

/* ---------------------------------------
   SECTION C — Chakra Card Component
---------------------------------------- */
function ChakraCard({
  chakra,
  isExpanded,
  onToggle,
}: {
  chakra: ChakraData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const glowBg  = chakra.color + '18';
  const ringCol = chakra.color + '55';

  return (
    <View style={[styles.card, isExpanded && { borderColor: chakra.color + '55' }]}>
      {/* Colored left rail */}
      <View style={[styles.cardRail, { backgroundColor: chakra.color }]} />

      {/* Card content */}
      <View style={styles.cardInner}>

        {/* ── Header row (always visible) ── */}
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={onToggle}
          style={styles.cardHeader}
        >
          {/* Number badge */}
          <View style={[styles.numberBadge, { backgroundColor: glowBg, borderColor: ringCol }]}>
            <Text style={[styles.numberText, { color: chakra.color }]}>{chakra.number}</Text>
          </View>

          {/* Names + meta */}
          <View style={styles.cardMeta}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.chakraName}>{chakra.name}</Text>
              <Text style={styles.hzBadge}>{chakra.hz} Hz</Text>
            </View>
            <Text style={styles.sanskritName}>{chakra.sanskrit}</Text>
            <View style={styles.tagsRow}>
              <Text style={styles.locationTag}>{chakra.location}</Text>
              <Text style={styles.dotSep}>·</Text>
              <Text style={[styles.themesTag, { color: chakra.color }]}>{chakra.themes}</Text>
            </View>
          </View>

          {/* Expand chevron */}
          <Text style={[styles.chevron, isExpanded && styles.chevronUp]}>›</Text>
        </TouchableOpacity>

        {/* ── Expanded content ── */}
        {isExpanded && (
          <View style={styles.expandedBody}>
            <View style={[styles.expandedDivider, { backgroundColor: chakra.color + '40' }]} />

            {/* Affirmation */}
            <View style={styles.expandedSection}>
              <Text style={styles.expandedLabel}>Affirmation</Text>
              <Text style={[styles.affirmationText, { color: chakra.color }]}>
                "{chakra.affirmation}"
              </Text>
            </View>

            {/* Balanced / Imbalanced */}
            <View style={styles.balanceRow}>
              <View style={styles.balanceCol}>
                <View style={styles.balanceTitleRow}>
                  <View style={[styles.balanceDot, { backgroundColor: '#27AE60' }]} />
                  <Text style={styles.expandedLabel}>Balanced</Text>
                </View>
                <Text style={styles.expandedBody2}>{chakra.balanced}</Text>
              </View>
              <View style={styles.balanceDividerV} />
              <View style={styles.balanceCol}>
                <View style={styles.balanceTitleRow}>
                  <View style={[styles.balanceDot, { backgroundColor: '#C0392B' }]} />
                  <Text style={styles.expandedLabel}>Imbalanced</Text>
                </View>
                <Text style={styles.expandedBody2}>{chakra.imbalanced}</Text>
              </View>
            </View>

            {/* Guided Meditation */}
            <View style={styles.expandedSection}>
              <Text style={styles.expandedLabel}>Guided Meditation</Text>
              <Text style={styles.meditationText}>{chakra.meditation}</Text>
            </View>

            {/* Play button */}
            <Link
              href={{
                pathname: '/test',
                params: {
                  title: `${chakra.name} Chakra · ${chakra.hz} Hz`,
                  description: `A ${chakra.hz} Hz vibroacoustic journey through the ${chakra.name} chakra — ${chakra.themes.toLowerCase()}`,
                  sound: chakra.sound,
                },
              }}
              asChild
            >
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.playBtn, { backgroundColor: chakra.color + '22', borderColor: chakra.color + '66' }]}
              >
                <Text style={[styles.playBtnIcon, { color: chakra.color }]}>▶</Text>
                <Text style={[styles.playBtnText, { color: chakra.color }]}>
                  Play {chakra.hz} Hz Session
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </View>
  );
}

/* ---------------------------------------
   SECTION D — Screen Component
---------------------------------------- */
export default function ChakrasScreen() {
  const { isTabletLandscape, isTabletPortrait } = useResponsive();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
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

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Energy Centers</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>
          Chakras
        </Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Seven sacred centers of life force energy — tap to explore
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* ── Chakra rainbow indicator ── */}
      <View style={styles.rainbowBar}>
        {CHAKRAS.map((c) => (
          <View
            key={c.id}
            style={[
              styles.rainbowSegment,
              { backgroundColor: c.color },
              expandedId === c.id && styles.rainbowSegmentActive,
            ]}
          />
        ))}
      </View>

      {/* ── Section label ── */}
      <View style={styles.sectionLabelRow}>
        <View style={styles.sectionLabelLine} />
        <Text style={styles.sectionLabelText}>All 7 Chakras</Text>
        <View style={styles.sectionLabelLine} />
      </View>

      {/* ── Chakra cards ── */}
      <View style={styles.cardList}>
        {CHAKRAS.map((chakra) => (
          <ChakraCard
            key={chakra.id}
            chakra={chakra}
            isExpanded={expandedId === chakra.id}
            onToggle={() => handleToggle(chakra.id)}
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

  // ── Rainbow indicator ──
  rainbowBar: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 24,
    gap: 2,
  },
  rainbowSegment: {
    flex: 1,
    borderRadius: 99,
    opacity: 0.4,
  },
  rainbowSegmentActive: {
    opacity: 1,
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
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
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
  chakraName: {
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
  sanskritName: {
    fontSize: 11,
    color: C.textDim,
    fontWeight: '300',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  locationTag: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '300',
  },
  dotSep: {
    fontSize: 11,
    color: C.textDim,
  },
  themesTag: {
    fontSize: 11,
    fontWeight: '500',
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
  balanceRow: {
    flexDirection: 'row',
    gap: 14,
  },
  balanceCol: {
    flex: 1,
    gap: 6,
  },
  balanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  balanceDividerV: {
    width: 1,
    backgroundColor: C.borderPurple,
  },
  expandedBody2: {
    fontSize: 12,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 18,
  },
  meditationText: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 21,
    fontStyle: 'italic',
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
