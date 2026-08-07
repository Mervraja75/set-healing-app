// =======================================
// SCREEN: Subscribe (app/subscribe.tsx)
// Purpose: UI-only subscription / paywall screen
// Notes:
// - No real store purchase logic yet (placeholder actions)
// - Store products aren't set up — wire up expo-in-app-purchases /
//   RevenueCat here once they exist
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { GOLD, goldAlpha } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackButton from '@/components/BackButton';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#0A0616',
  bgCard:       '#1A0D2E',
  bgCardDeep:   '#160A28',
  bgHero:       '#1E0A3C',

  goldBright:   GOLD,

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   goldAlpha(0.15),
  borderPurple: 'rgba(180, 140, 255, 0.10)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.18)',
};

/* ---------------------------------------
   STATIC DATA
---------------------------------------- */
const FEATURES = [
  'All playlists',
  'Frequencies',
  'Meditations',
  'Hypnotherapy',
  'Breathwork',
  'Yoga',
  'Tai Chi',
  'Affirmations',
  'Healing Journal',
];

type PlanId = 'monthly' | 'yearly';

const PLANS: {
  id: PlanId;
  label: string;
  price: string;
  period: string;
  note?: string;
  badge?: string;
}[] = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$14.99',
    period: '/ month',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$149.99',
    period: '/ year',
    note: '≈ $12.50 / month',
    badge: 'Save 2 months',
  },
];

/* ---------------------------------------
   SECTION B — Component
---------------------------------------- */
export default function SubscribeScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

  /* -------------------------------------
     SECTION C — Placeholder actions
     No store products yet — stub for now.
  -------------------------------------- */
  const handleSubscribe = () => {
    console.log('[Subscribe] Placeholder purchase for plan:', selectedPlan);
  };

  const handleRestore = () => {
    console.log('[Subscribe] Placeholder restore purchases');
  };

  /* -------------------------------------
     SECTION D — UI Layout
  -------------------------------------- */
  return (
    <View style={styles.screen}>
      {/* Ambient glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.topBar}>
        <BackButton compact />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Brand mark ── */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoMark}>SET</Text>
          <Text style={styles.logoSub}>Healing</Text>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>Unlock your complete healing journey</Text>
        <Text style={styles.subheadline}>
          Everything you need to heal, rebalance, and grow — in one subscription.
        </Text>

        {/* ── Feature list ── */}
        <View style={styles.featureCard}>
          <View style={styles.featureGrid}>
            {FEATURES.map((feature) => (
              <View key={feature} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={C.goldBright} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Pricing cards ── */}
        <View style={styles.pricingRow}>
          {PLANS.map((plan) => {
            const selected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, selected && styles.planCardSelected]}
                activeOpacity={0.85}
                onPress={() => setSelectedPlan(plan.id)}
                accessibilityRole="button"
                accessibilityLabel={`${plan.label} plan, ${plan.price} ${plan.period}`}
                accessibilityState={{ selected }}
              >
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}

                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>

                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
                {plan.note && <Text style={styles.planNote}>{plan.note}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Subscribe CTA ── */}
        <TouchableOpacity
          style={styles.subscribeBtn}
          activeOpacity={0.9}
          onPress={handleSubscribe}
          accessibilityRole="button"
          accessibilityLabel="Subscribe"
        >
          <Text style={styles.subscribeBtnText}>Subscribe</Text>
        </TouchableOpacity>

        {/* ── Restore purchases ── */}
        <TouchableOpacity
          onPress={handleRestore}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Restore purchases"
          style={styles.restoreBtn}
        >
          <Text style={styles.restoreBtnText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* ── Fine print ── */}
        <Text style={styles.finePrint}>
          Subscriptions renew automatically unless canceled at least 24 hours
          before the end of the current period. Cancel anytime in your App
          Store or Google Play account settings. By subscribing, you agree to
          our{' '}
          <Link href="/terms" asChild>
            <Text style={styles.finePrintLink}>Terms of Service</Text>
          </Link>{' '}
          and{' '}
          <Link href="/privacy" asChild>
            <Text style={styles.finePrintLink}>Privacy Policy</Text>
          </Link>
          .
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* ---------------------------------------
   SECTION E — Styles
---------------------------------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  topBar: {
    position: 'absolute',
    top: 55,
    left: 18,
    zIndex: 10,
  },

  // Glows (absolute, behind scroll content)
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

  scrollContent: {
    paddingHorizontal: 26,
    paddingTop: 110,
    paddingBottom: 24,
  },

  // Logo
  logoWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoMark: {
    fontSize: 40,
    fontWeight: '800',
    color: C.goldBright,
    letterSpacing: -1,
    lineHeight: 42,
  },
  logoSub: {
    fontSize: 12,
    letterSpacing: 6,
    textTransform: 'uppercase',
    color: C.textMid,
    fontWeight: '300',
  },

  // Headline
  headline: {
    fontSize: 26,
    fontWeight: '700',
    color: C.textBright,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 32,
    marginBottom: 10,
  },
  subheadline: {
    fontSize: 14,
    color: C.textMid,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
    paddingHorizontal: 8,
  },

  // Feature list
  featureCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    padding: 18,
    marginBottom: 26,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '50%',
    paddingVertical: 7,
    paddingRight: 6,
  },
  featureText: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '400',
    flexShrink: 1,
  },

  // Pricing cards
  pricingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  planCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.borderPurple,
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: C.goldBright,
    backgroundColor: C.bgHero,
    shadowColor: C.goldBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  planBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: C.goldBright,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 12,
  },
  planBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: C.bg,
    textTransform: 'uppercase',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.borderPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  radioOuterSelected: {
    borderColor: C.goldBright,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.goldBright,
  },
  planLabel: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '500',
    marginBottom: 6,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: C.textBright,
    letterSpacing: -0.5,
  },
  planPeriod: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '300',
    marginTop: 1,
  },
  planNote: {
    fontSize: 11,
    color: C.goldBright,
    fontWeight: '500',
    marginTop: 8,
  },

  // Subscribe CTA
  subscribeBtn: {
    backgroundColor: C.goldBright,
    borderRadius: 99,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: C.goldBright,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  subscribeBtnText: {
    color: C.bg,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // Restore purchases
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 18,
  },
  restoreBtnText: {
    color: C.textMid,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // Fine print
  finePrint: {
    fontSize: 11,
    color: C.textDim,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 6,
  },
  finePrintLink: {
    color: C.goldBright,
    fontWeight: '500',
  },
});
