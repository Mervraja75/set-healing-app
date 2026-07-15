// =======================================
// SCREEN: Onboarding (app/onboarding.tsx)
// Day 100 — First-launch onboarding flow
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/* ---------------------------------------
   DESIGN TOKENS — matches login.tsx
---------------------------------------- */
const C = {
  bg:         '#0A0616',
  bgCardDeep: '#160A28',

  goldBright: '#C9A84C',

  textBright: '#FFFFFF',
  textMid:    '#DDD0FF',
  textDim:    '#7A60A0',

  borderGold:   'rgba(201, 168, 76, 0.15)',
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:   'rgba(201, 168, 76, 0.08)',
  glowPurple: 'rgba(100, 50, 180, 0.18)',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = 'onboarding_complete';

/* ---------------------------------------
   SECTION B — Slide content
---------------------------------------- */
type Slide = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    icon: 'sparkles',
    title: 'Welcome to SET Healing',
    description: 'Restore harmony through sacred frequency.',
  },
  {
    key: 'frequencies',
    icon: 'pulse',
    title: 'Healing Frequencies',
    description:
      '50 scientifically studied frequencies for sleep, calm, focus and cellular restoration.',
  },
  {
    key: 'journey',
    icon: 'arrow-forward-circle',
    title: 'Begin Your Journey',
    description:
      'Join thousands experiencing the power of sound energy therapy.',
  },
];

/* ---------------------------------------
   SECTION C — Component
---------------------------------------- */
export default function OnboardingScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLastSlide = index === SLIDES.length - 1;

  /* -------------------------------------
     SECTION C1 — Completion
  -------------------------------------- */
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } finally {
      router.replace('/(tabs)');
    }
  };

  /* -------------------------------------
     SECTION C2 — Navigation between slides
  -------------------------------------- */
  const handleNext = () => {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setIndex(newIndex);
  };

  /* -------------------------------------
     SECTION C3 — Render
  -------------------------------------- */
  return (
    <View style={styles.screen}>
      {/* Ambient glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Skip — hidden on the last slide */}
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={completeOnboarding}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={72} color={C.goldBright} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {item.key === SLIDES[SLIDES.length - 1].key && (
              <Text style={styles.disclaimer}>
                SET Healing is a wellness app designed for relaxation and
                personal well-being. It is not a medical device and does not
                diagnose, treat, cure, or prevent any disease or medical
                condition. Always consult a qualified healthcare
                professional for medical advice.
              </Text>
            )}
          </View>
        )}
      />

      {/* Progress dots + CTA */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {SLIDES.map((slide, i) => (
            <View
              key={slide.key}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------------------------------
   STYLES
---------------------------------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Ambient glows
  glowTop: {
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: C.glowGold,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: C.glowPurple,
  },

  // Skip button
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.textDim,
    letterSpacing: 0.5,
  },

  // Slide
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: C.bgCardDeep,
    borderWidth: 1,
    borderColor: C.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: C.textBright,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    fontWeight: '300',
    color: C.textMid,
    textAlign: 'center',
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '300',
    color: C.textDim,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 20,
    paddingHorizontal: 8,
  },

  // Footer — dots + button
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.borderPurple,
  },
  dotActive: {
    width: 24,
    backgroundColor: C.goldBright,
  },

  // Next / Get Started button
  nextBtn: {
    width: '100%',
    backgroundColor: C.goldBright,
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: C.goldBright,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  nextBtnText: {
    color: C.bg,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
