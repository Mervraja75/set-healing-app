// =======================================
// SCREEN: Affirmations (app/(tabs)/affirmations.tsx)
// Day 91 — Category list + full-screen affirmation player
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { useRef, useState } from 'react';
import { GOLD, goldAlpha } from '@/constants/Colors';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import BackButton from '@/components/BackButton';

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
type AffirmationCategory = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  affirmations: string[];
};

const CATEGORIES: AffirmationCategory[] = [
  {
    id: 'prosperity',
    name: 'Prosperity',
    subtitle: 'Divine Abundance · Financial Freedom',
    color: GOLD,
    affirmations: [
      'I am a magnet for abundance in all its forms.',
      'Money flows to me easily and effortlessly.',
      'I am worthy of wealth and complete financial freedom.',
      'Prosperity is my divine birthright.',
      'I release every limiting belief I hold about money.',
      'The universe provides for all of my needs with grace.',
      'I create immense value and I am richly rewarded.',
      'Abundance is all around me — I open myself to receive it.',
      'Every day my relationship with wealth deepens and expands.',
    ],
  },
  {
    id: 'health',
    name: 'Health & Healing',
    subtitle: 'Vibrant Vitality · Cellular Restoration',
    color: '#27AE60',
    affirmations: [
      'My body is a temple of radiant, vibrant health.',
      'Every cell in my body vibrates with healing energy.',
      'I am deeply grateful for my body\'s innate wisdom to heal.',
      'Vitality and life force flow through me freely.',
      'I nourish my body with love and it serves me beautifully.',
      'My immune system is powerful and perfectly calibrated.',
      'I release all that no longer serves my highest health.',
      'I am becoming healthier, stronger, and more whole every day.',
      'My body knows how to heal — I trust it completely.',
    ],
  },
  {
    id: 'love',
    name: 'Love & Relationships',
    subtitle: 'Heart Opening · Deep Connection',
    color: '#E84393',
    affirmations: [
      'I am deeply worthy of love, exactly as I am.',
      'My heart is open to give and receive love freely.',
      'I attract relationships that honor, uplift, and nourish me.',
      'Love begins within me and radiates into the world.',
      'I release past wounds and welcome new beginnings with grace.',
      'I am surrounded by love in seen and unseen forms.',
      'My connections deepen and flourish naturally.',
      'I am fully seen, fully known, and deeply loved.',
      'The love I seek already lives inside of me.',
    ],
  },
  {
    id: 'self-worth',
    name: 'Self Worth',
    subtitle: 'Confidence · Inner Power',
    color: '#8E44AD',
    affirmations: [
      'I am enough, exactly as I am in this moment.',
      'My worth is inherent, unconditional, and unchanging.',
      'I trust myself completely and honour my own knowing.',
      'I speak my truth with confidence and compassion.',
      'I release the need for approval from anyone outside myself.',
      'I am proud of the person I am becoming.',
      'My presence is a genuine gift to the world.',
      'I stand fully in my power with grace and ease.',
      'I deserve all the good life has to offer.',
    ],
  },
  {
    id: 'peace',
    name: 'Peace & Calm',
    subtitle: 'Stillness · Nervous System Rest',
    color: '#3498DB',
    affirmations: [
      'I choose peace in this moment and in every moment.',
      'My nervous system is calm, balanced, and fully restored.',
      'I release what I cannot control with ease and trust.',
      'Stillness lives at the unwavering center of my being.',
      'I breathe deeply and trust the unfolding of life.',
      'Peace is not something I find — it is what I am.',
      'I am safe, and all is well in my world.',
      'I return to calm with every conscious breath I take.',
      'The present moment holds everything I need.',
    ],
  },
  {
    id: 'spiritual',
    name: 'Spiritual Growth',
    subtitle: 'Higher Self · Divine Connection',
    color: '#9B59B6',
    affirmations: [
      'I am aligned with my highest purpose and calling.',
      'The universe guides and supports every step I take.',
      'I am an infinite spiritual being in a human experience.',
      'My intuition is strong, clear, and completely trustworthy.',
      'I am always connected to divine wisdom and love.',
      'I expand into greater versions of myself with ease.',
      'I trust the sacred unfolding of my unique journey.',
      'I am one with all that is, has been, and ever will be.',
      'My soul knows exactly where it is going.',
    ],
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    subtitle: 'Appreciation · Abundance Mindset',
    color: '#F1C40F',
    affirmations: [
      'I am deeply grateful for the miracle of this moment.',
      'Appreciation unlocks the infinite fullness of life.',
      'I find beauty and hidden blessings everywhere I look.',
      'Gratitude multiplies everything I cherish.',
      'I give thanks for my body, my breath, and my life.',
      'Every challenge I face is a gift in a sacred disguise.',
      'I live in a continuous state of grace and appreciation.',
      'The more I am grateful, the more I have to be grateful for.',
      'Gratitude is the bridge between where I am and where I am going.',
    ],
  },
];

/* ---------------------------------------
   SECTION C — Category Card
---------------------------------------- */
function CategoryCard({
  category,
  onPress,
}: {
  category: AffirmationCategory;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={styles.card}>
      <View style={[styles.cardAccentBar, { backgroundColor: category.color }]} />
      <View style={styles.cardBody}>
        <View style={[styles.cardDot, { backgroundColor: category.color }]} />
        <View style={styles.cardTextBlock}>
          <Text style={styles.cardName}>{category.name}</Text>
          <Text style={styles.cardSubtitle}>{category.subtitle}</Text>
        </View>
        <View style={[styles.countPill, { borderColor: category.color + '55' }]}>
          <Text style={[styles.countText, { color: category.color }]}>
            {category.affirmations.length}
          </Text>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------------------------------
   SECTION D — Affirmation Player
---------------------------------------- */
function AffirmationPlayer({
  category,
  onBack,
}: {
  category: AffirmationCategory;
  onBack: () => void;
}) {
  const { isTablet } = useResponsive();
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const total = category.affirmations.length;

  const transition = (nextIndex: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setIndex(nextIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePrev = () => transition((index - 1 + total) % total);
  const handleNext = () => transition((index + 1) % total);

  return (
    <View style={styles.playerRoot}>
      {/* Top bar */}
      <View style={styles.playerTopBar}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.playerBackBtn}>
          <Text style={styles.playerBackText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Category label */}
      <View style={styles.playerHeader}>
        <Text style={[styles.playerEyebrow, { color: category.color }]}>
          {category.name.toUpperCase()}
        </Text>
        <Text style={styles.playerSubtitle}>{category.subtitle}</Text>
      </View>

      <View style={[styles.playerRule, { backgroundColor: category.color + '33' }]} />

      {/* Affirmation display */}
      <View style={styles.affirmationContainer}>
        {/* Decorative opening quote */}
        <Text style={[styles.decorativeQuote, { color: category.color + '30' }]}>"</Text>

        <Animated.Text
          style={[
            styles.affirmationText,
            isTablet && styles.affirmationTextTablet,
            { opacity: fadeAnim },
          ]}
        >
          {category.affirmations[index]}
        </Animated.Text>

        {/* Counter */}
        <Text style={styles.counterText}>
          {index + 1} / {total}
        </Text>
      </View>

      {/* Navigation + progress dots */}
      <View style={styles.navSection}>
        {/* Prev / Next */}
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={handlePrev}
            activeOpacity={0.7}
            style={[styles.navBtn, { borderColor: category.color + '55' }]}
          >
            <Text style={[styles.navBtnText, { color: category.color }]}>‹</Text>
          </TouchableOpacity>

          {/* Progress dots */}
          <View style={styles.dotsRow}>
            {category.affirmations.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => i !== index && transition(i)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <View
                  style={[
                    styles.dot,
                    i === index
                      ? { backgroundColor: category.color, width: 16 }
                      : { backgroundColor: C.textDim + '66' },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.7}
            style={[styles.navBtn, { borderColor: category.color + '55' }]}
          >
            <Text style={[styles.navBtnText, { color: category.color }]}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 48 }} />
    </View>
  );
}

/* ---------------------------------------
   SECTION E — Screen Component
---------------------------------------- */
export default function AffirmationsScreen() {
  const { isTabletLandscape, isTabletPortrait } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<AffirmationCategory | null>(null);

  if (selectedCategory) {
    return (
      <View style={styles.root}>
        <AffirmationPlayer
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      </View>
    );
  }

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
      <View style={styles.topBar}>
        <BackButton to="/(tabs)/explore" />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Sacred Words</Text>
        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>
          Affirmations
        </Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
          Words that rewire, restore, and remind you of who you are
        </Text>
      </View>

      <View style={styles.goldRule} />

      {/* Section label */}
      <View style={styles.sectionLabelRow}>
        <View style={styles.sectionLabelLine} />
        <Text style={styles.sectionLabelText}>Categories</Text>
        <View style={styles.sectionLabelLine} />
      </View>

      {/* Category cards */}
      <View style={isTabletLandscape ? styles.gridTablet : styles.list}>
        {CATEGORIES.map((cat) => (
          <View
            key={cat.id}
            style={isTabletLandscape ? styles.gridItem : undefined}
          >
            <CategoryCard category={cat} onPress={() => setSelectedCategory(cat)} />
          </View>
        ))}
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

/* ---------------------------------------
   SECTION F — Styles
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

  topBar: {
    position: 'absolute',
    top: 55,
    left: 18,
    zIndex: 10,
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

  list: { gap: 12 },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: { width: '48%' },

  // ── Category card ──
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
  cardDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    flexShrink: 0,
  },
  cardTextBlock: {
    flex: 1,
    gap: 4,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '300',
  },
  countPill: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 3,
    flexShrink: 0,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardArrow: {
    fontSize: 22,
    color: C.textDim,
    fontWeight: '300',
    flexShrink: 0,
  },

  // ── Affirmation player ──
  playerRoot: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 28,
  },

  playerTopBar: {
    marginBottom: 28,
  },
  playerBackBtn: {
    alignSelf: 'flex-start',
  },
  playerBackText: {
    fontSize: 14,
    color: C.textMuted,
    fontWeight: '400',
    letterSpacing: 0.3,
  },

  playerHeader: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  playerEyebrow: {
    fontSize: 10,
    letterSpacing: 5,
    fontWeight: '600',
  },
  playerSubtitle: {
    fontSize: 12,
    color: C.textDim,
    fontWeight: '300',
    letterSpacing: 0.5,
  },

  playerRule: {
    height: 1,
    marginHorizontal: 20,
    marginBottom: 0,
  },

  // ── Affirmation display ──
  affirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  decorativeQuote: {
    fontSize: 96,
    lineHeight: 80,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: -16,
  },
  affirmationText: {
    fontSize: 26,
    fontWeight: '300',
    color: C.textBright,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: 0.2,
    fontStyle: 'italic',
  },
  affirmationTextTablet: {
    fontSize: 34,
    lineHeight: 52,
  },
  counterText: {
    fontSize: 11,
    color: C.textDim,
    letterSpacing: 2,
    fontWeight: '300',
    marginTop: 28,
  },

  // ── Navigation ──
  navSection: {
    paddingBottom: 12,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  navBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    flexShrink: 0,
  },
  navBtnText: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },

  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
});
