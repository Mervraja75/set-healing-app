// =======================================
// SCREEN: Profile (app/(tabs)/profile.tsx)
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/* ---------------------------------------
   DESIGN TOKENS
---------------------------------------- */
const C = {
  bg:           '#120828',
  bgCard:       '#1E0A30',
  bgCardDeep:   '#250D3D',
  bgHero:       '#2D0F50',

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

  aurora:       '#7EFFD4',
};

/* ---------------------------------------
   COMPONENT
---------------------------------------- */
export default function ProfileScreen() {
  const { isGuest, continueAsGuest } = useAuth();

  return (
    <ScrollView
      style={{ backgroundColor: C.bg }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Avatar circle */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarSymbol}>◎</Text>
          </View>
          <View style={styles.avatarRing1} />
          <View style={styles.avatarRing2} />
        </View>

        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>
          {isGuest
            ? 'Exploring as a guest — sign in to personalize your journey.'
            : 'You are signed in. Enjoy your healing experience.'}
        </Text>

        {/* Guest / signed-in status pill */}
        <View style={[styles.statusPill, isGuest && styles.statusPillGuest]}>
          <View style={[styles.statusDot, isGuest && styles.statusDotGuest]} />
          <Text style={[styles.statusText, isGuest && styles.statusTextGuest]}>
            {isGuest ? 'Guest mode' : 'Signed in'}
          </Text>
        </View>
      </View>

      <View style={styles.goldRule} />

      {/* ── Upgrade card ── */}
      <Link href="/paywall" asChild>
        <TouchableOpacity style={styles.upgradeCard} activeOpacity={0.85}>
          <View style={styles.upgradeCardGlow} />
          <View style={styles.upgradeBadgeRow}>
            <View style={styles.upgradeBadgeDot} />
            <Text style={styles.upgradeBadgeText}>Premium</Text>
          </View>
          <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
          <Text style={styles.upgradeBody}>
            Unlock premium collections, save favourites, and track your
            healing progress.
          </Text>
          <View style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Unlock Pro  →</Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* ── Info card ── */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why create an account?</Text>
        {[
          'Save your favourite sounds',
          'Resume your last session',
          'Track your healing habits',
        ].map((item) => (
          <View key={item} style={styles.infoRow}>
            <View style={styles.infoRowDot} />
            <Text style={styles.infoRowText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* ── Actions ── */}
      <View style={styles.actions}>
        {/* Log In — primary gold */}
        <Link href="/login" asChild>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Log in to your account"
            style={styles.primaryBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Log In</Text>
          </TouchableOpacity>
        </Link>

        {/* Create Account — ghost gold */}
        <Link href="/register" asChild>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Create a new account"
            style={styles.ghostBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.ghostBtnText}>Create Account</Text>
          </TouchableOpacity>
        </Link>

        {/* Continue as Guest — dim, only shown when guest */}
        {isGuest && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Continue as guest"
            style={styles.guestBtn}
            onPress={continueAsGuest}
            activeOpacity={0.75}
          >
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>Sound Energy Therapy</Text>
        <View style={styles.footerLine} />
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

  glowTop: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: C.glowGold,
  },
  glowBottom: {
    position: 'absolute',
    top: 600,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: C.glowPurple,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: C.bgHero,
    borderWidth: 1,
    borderColor: C.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarSymbol: {
    fontSize: 28,
    color: C.goldBright,
  },
  avatarRing1: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(212,168,40,0.2)',
  },
  avatarRing2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(212,168,40,0.10)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.textBright,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMid,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 20,
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(126,255,212,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(126,255,212,0.2)',
    borderRadius: 99,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  statusPillGuest: {
    backgroundColor: 'rgba(212,168,40,0.08)',
    borderColor: C.borderGold,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: C.aurora,
  },
  statusDotGuest: {
    backgroundColor: C.goldBright,
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: C.aurora,
    fontWeight: '500',
  },
  statusTextGuest: {
    color: C.goldBright,
  },

  goldRule: {
    height: 1,
    backgroundColor: C.borderGold,
    marginVertical: 20,
    marginHorizontal: 20,
  },

  // Upgrade card
  upgradeCard: {
    backgroundColor: C.bgHero,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
  },
  upgradeCardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(212,168,40,0.08)',
  },
  upgradeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  upgradeBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: C.goldBright,
  },
  upgradeBadgeText: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: C.goldMid,
    fontWeight: '500',
  },
  upgradeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.textBright,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  upgradeBody: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeBtn: {
    alignSelf: 'flex-start',
    backgroundColor: C.goldBright,
    borderRadius: 99,
    paddingVertical: 11,
    paddingHorizontal: 22,
  },
  upgradeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.bg,
    letterSpacing: 1,
  },

  // Info card
  infoCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: C.borderPurple,
    marginBottom: 22,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textBright,
    marginBottom: 14,
    letterSpacing: 0.1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoRowDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: C.goldBright,
    flexShrink: 0,
  },
  infoRowText: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 19,
  },

  // Action buttons
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  primaryBtn: {
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
  primaryBtnText: {
    color: C.bg,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  ghostBtn: {
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,40,0.04)',
  },
  ghostBtnText: {
    color: C.goldBright,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
  },
  guestBtn: {
    borderWidth: 1,
    borderColor: C.borderPurple,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  guestBtnText: {
    color: C.textDim,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  footerText: {
    fontSize: 9,
    color: C.textDim,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '300',
  },
});