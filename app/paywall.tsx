// =======================================
// SCREEN: Paywall
// Purpose: UI-only "Upgrade to Pro" screen
// Notes:
// - No real payments yet (placeholder actions)
// - Can later connect to RevenueCat / Stripe / IAP
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthContext';

/* ---------------------------------------
   SECTION B — Component
---------------------------------------- */
export default function PaywallScreen() {

  /* -------------------------------------
     SECTION B1 — Navigation + Context
  -------------------------------------- */
  const router = useRouter();
  const auth = useAuth();

  /* -------------------------------------
     SECTION C — Helpers / Actions (UI-only)
     ✅ Later: Replace these with real payment logic
  -------------------------------------- */
  const activatePro = () => {
    // Try to call an explicit upgrade function if your context provides one
    if (typeof (auth as any).upgradeToPro === 'function') {
      try {
        (auth as any).upgradeToPro();
        console.log('upgradeToPro called (UI-only)');
      } catch (e) {
        console.log('upgradeToPro failed', e);
      }
    } else if (typeof (auth as any).setIsPro === 'function') {
      try {
        (auth as any).setIsPro(true);
        console.log('setIsPro(true) called (UI-only)');
      } catch (e) {
        console.log('setIsPro failed', e);
      }
    } else {
      // fallback: if no setter is available, just log and navigate
      console.log('No upgrade function on AuthContext - UI-only');
    }

    // Navigate to profile (where pro status can be shown)
    router.replace('/(tabs)/profile');
  };

  const restorePurchase = () => {
    // Placeholder: same behaviour for now
    console.log('restorePurchase (UI-only)');
    activatePro();
  };

  /* -------------------------------------
     SECTION D — UI Layout
  -------------------------------------- */
  return (
    <View style={styles.container}>

      {/* SECTION D1 — Top Bar */}
      <View style={styles.headerRow}>
        <BackButton to="/(tabs)/profile" label="Back" compact />
      </View>

      {/* SECTION D2 — Header */}
      <Text style={styles.title}>Go Pro</Text>
      <Text style={styles.subtitle}>
        Unlock full access to healing sessions and premium features.
      </Text>

      {/* SECTION D3 — Benefits Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What you get</Text>
        <Text style={styles.bullet}>• Unlimited collections</Text>
        <Text style={styles.bullet}>• Save favorites</Text>
        <Text style={styles.bullet}>• Resume your last session</Text>
        <Text style={styles.bullet}>• Offline listening (coming soon)</Text>
      </View>

      {/* SECTION D4 — Pricing (UI only) */}
      <View style={styles.pricingRow}>
        <View style={[styles.priceBox, styles.priceBoxActive]}>
          <Text style={styles.priceTitle}>Monthly</Text>
          <Text style={styles.priceValue}>$4.99</Text>
          <Text style={styles.priceNote}>per month</Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceTitle}>Yearly</Text>
          <Text style={styles.priceValue}>$39.99</Text>
          <Text style={styles.priceNote}>save 30%</Text>
        </View>
      </View>

      {/* SECTION D5 — CTA Buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.9}
        onPress={activatePro}
        accessibilityRole="button"
        accessibilityLabel="Start free trial"
      >
        <Text style={styles.primaryText}>Start Free Trial</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        activeOpacity={0.9}
        onPress={restorePurchase}
        accessibilityRole="button"
        accessibilityLabel="Restore purchase"
      >
        <Text style={styles.secondaryText}>Restore Purchase</Text>
      </TouchableOpacity>

      {/* SECTION D6 — Footer Links / Notes */}
      <Link href="/(tabs)/profile" asChild>
        <Text style={styles.notNow}>Not now</Text>
      </Link>

      <Text style={styles.smallPrint}>
        Payments will be added later. This is UI only for now.
      </Text>
    </View>
  );
}

/* ---------------------------------------
   SECTION E — Styles
---------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
    paddingTop: 52,
    paddingHorizontal: 24,
  },
  headerRow: {
    // leave space for back button
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#3A0CA3',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6DCF7',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5A189A',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  priceBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6DCF7',
  },
  priceBoxActive: {
    borderColor: '#5A189A',
    backgroundColor: '#F2EAFF',
  },
  priceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5A189A',
    marginBottom: 6,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3A0CA3',
    marginBottom: 2,
  },
  priceNote: {
    fontSize: 12,
    color: '#777',
  },
  primaryButton: {
    backgroundColor: '#5A189A',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  primaryText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#5A189A',
    marginBottom: 14,
  },
  secondaryText: {
    color: '#5A189A',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  notNow: {
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  smallPrint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
});