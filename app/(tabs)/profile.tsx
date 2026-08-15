// =======================================
// SCREEN: Profile (app/(tabs)/profile.tsx)
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { useEffect, useState } from 'react';
import { GOLD, goldAlpha } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from 'expo-router';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { cancelAllNotifications, scheduleMeditationReminder } from '@/services/NotificationService';

/* ---------------------------------------
   NOTIFICATION PRESETS
---------------------------------------- */
const NOTIF_ENABLED_KEY = 'notifications_enabled';
const NOTIF_PRESET_KEY  = 'notifications_preset';

type PresetKey = 'morning' | 'afternoon' | 'evening';

const PRESETS: Record<PresetKey, { label: string; time: string; hour: number; minute: number }> = {
  morning:   { label: 'Morning',   time: '8:00 AM', hour: 8,  minute: 0 },
  afternoon: { label: 'Afternoon', time: '2:00 PM', hour: 14, minute: 0 },
  evening:   { label: 'Evening',   time: '8:00 PM', hour: 20, minute: 0 },
};

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

  aurora:       '#7EFFD4',
};

/* ---------------------------------------
   COMPONENT
---------------------------------------- */
export default function ProfileScreen() {
  const { isGuest, continueAsGuest, userRole, user, logout } = useAuth();
  const { isTablet, isTabletPortrait, spacing } = useResponsive();
  const router = useRouter();
  const isAdmin = userRole === 'admin';

  // TEMP — Day 100: lets admins re-trigger the onboarding flow for testing.
  const handlePreviewOnboarding = async () => {
    await AsyncStorage.removeItem('onboarding_complete');
    router.replace('/onboarding');
  };

  /* -------------------------------------
     Day 101 — Notification preferences
  -------------------------------------- */
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('morning');

  useEffect(() => {
    (async () => {
      const [enabled, preset] = await Promise.all([
        AsyncStorage.getItem(NOTIF_ENABLED_KEY),
        AsyncStorage.getItem(NOTIF_PRESET_KEY),
      ]);
      setNotificationsEnabled(enabled === 'true');
      if (preset === 'morning' || preset === 'afternoon' || preset === 'evening') {
        setSelectedPreset(preset);
      }
    })();
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem(NOTIF_ENABLED_KEY, value ? 'true' : 'false');
    await cancelAllNotifications();
    if (value) {
      const preset = PRESETS[selectedPreset];
      await scheduleMeditationReminder(preset.hour, preset.minute);
    }
  };

  const handleSelectPreset = async (key: PresetKey) => {
    setSelectedPreset(key);
    await AsyncStorage.setItem(NOTIF_PRESET_KEY, key);
    if (notificationsEnabled) {
      await cancelAllNotifications();
      await scheduleMeditationReminder(PRESETS[key].hour, PRESETS[key].minute);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: C.bg }}
      contentContainerStyle={[styles.container, { paddingHorizontal: spacing.horizontal }, isTablet && styles.containerTablet]}
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

        <Text style={[styles.title, isTabletPortrait && styles.titleTabletP]}>Your Profile</Text>
        <Text style={[styles.subtitle, isTabletPortrait && styles.subtitleTabletP]}>
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

        {/* Admin gold badge — visible for admin role only */}
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeStar}>★</Text>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.goldRule} />

      {/* ── My Favorites — visible for all signed-in users ── */}
      {!isGuest && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="View your favorites"
          style={styles.favoritesBtn}
          onPress={() => router.push('/favorites')}
          activeOpacity={0.85}
        >
          <Text style={styles.favoritesBtnIcon}>♥</Text>
          <Text style={styles.favoritesBtnText}>My Favorites</Text>
          <Text style={styles.favoritesBtnArrow}>›</Text>
        </TouchableOpacity>
      )}

      {isAdmin ? (
        /* ── Admin: email + sign out ── */
        <View style={styles.adminInfoCard}>
          <Text style={styles.adminEmailLabel}>Signed in as</Text>
          <Text style={styles.adminEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={logout}
            activeOpacity={0.85}
          >
            <Text style={styles.signOutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
        </>
      )}

      {/* ── Notifications — visible for all logged-in users ── */}
      {!isGuest && (
        <View style={styles.notifSection}>
          <View style={styles.adminSectionLabelRow}>
            <View style={styles.adminSectionLine} />
            <Text style={styles.adminSectionLabelText}>Notifications</Text>
            <View style={styles.adminSectionLine} />
          </View>

          <View style={styles.notifCard}>
            <View style={styles.notifToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifToggleTitle}>Daily Healing Reminder</Text>
                <Text style={styles.notifToggleSubtitle}>
                  Get a gentle nudge to return to your practice.
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: C.borderPurple, true: C.goldMid }}
                thumbColor={notificationsEnabled ? C.goldBright : '#8A7CA8'}
              />
            </View>

            {notificationsEnabled && (
              <View style={styles.presetRow}>
                {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
                  const preset = PRESETS[key];
                  const active = selectedPreset === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      accessibilityRole="button"
                      accessibilityLabel={`${preset.label} reminder at ${preset.time}`}
                      style={[styles.presetPill, active && styles.presetPillActive]}
                      onPress={() => handleSelectPreset(key)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.presetPillLabel, active && styles.presetPillLabelActive]}>
                        {preset.label}
                      </Text>
                      <Text style={[styles.presetPillTime, active && styles.presetPillTimeActive]}>
                        {preset.time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      )}

      {/* ── Admin actions — visible for admin role only ── */}
      {isAdmin && (
        <View style={styles.adminSection}>
          <View style={styles.adminSectionLabelRow}>
            <View style={styles.adminSectionLine} />
            <Text style={styles.adminSectionLabelText}>Admin</Text>
            <View style={styles.adminSectionLine} />
          </View>

          {/* Practitioner Mode */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open Practitioner Mode"
            style={styles.adminPractitionerBtn}
            onPress={() => router.push('/(tabs)/practitioner')}
            activeOpacity={0.85}
          >
            <Text style={styles.adminPractitionerBtnText}>Practitioner Mode  ›</Text>
          </TouchableOpacity>

          {/* Admin Dashboard */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open Admin Dashboard"
            style={styles.adminDashBtn}
            onPress={() => Linking.openURL('https://set-healing-admin.vercel.app')}
            activeOpacity={0.85}
          >
            <Text style={styles.adminDashBtnText}>Admin Dashboard  →</Text>
          </TouchableOpacity>

          {/* Preview Onboarding — TEMP dev tool, admin-only */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Preview onboarding flow"
            style={styles.previewOnboardingBtn}
            onPress={handlePreviewOnboarding}
            activeOpacity={0.85}
          >
            <Text style={styles.previewOnboardingBtnText}>Preview Onboarding</Text>
          </TouchableOpacity>

          {/* TEMP — Preview Subscribe Screen. Remove once the new paywall
              design has been reviewed. */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Preview subscribe screen"
            style={styles.previewOnboardingBtn}
            onPress={() => router.push('/subscribe')}
            activeOpacity={0.85}
          >
            <Text style={styles.previewOnboardingBtnText}>Preview Subscribe Screen</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Legal ── */}
      <View style={styles.legalSection}>
        <View style={styles.legalLabelRow}>
          <View style={styles.legalLabelLine} />
          <Text style={styles.legalLabelText}>Legal</Text>
          <View style={styles.legalLabelLine} />
        </View>
        <View style={styles.legalCard}>
          <Link href="/privacy" asChild>
            <TouchableOpacity style={styles.legalRow} activeOpacity={0.72}>
              <Text style={styles.legalRowText}>Privacy Policy</Text>
              <Text style={styles.legalRowArrow}>›</Text>
            </TouchableOpacity>
          </Link>
          <View style={styles.legalDivider} />
          <Link href="/terms" asChild>
            <TouchableOpacity style={styles.legalRow} activeOpacity={0.72}>
              <Text style={styles.legalRowText}>Terms of Service</Text>
              <Text style={styles.legalRowArrow}>›</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
  containerTablet: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  titleTabletP:    { fontSize: 36 },
  subtitleTabletP: { fontSize: 15 },

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
    borderColor: goldAlpha(0.2),
  },
  avatarRing2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: goldAlpha(0.10),
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
    backgroundColor: goldAlpha(0.08),
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

  // My Favorites row
  favoritesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.bgCardDeep,
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  favoritesBtnIcon: {
    fontSize: 16,
    color: GOLD,
  },
  favoritesBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: C.textBright,
    letterSpacing: 0.2,
  },
  favoritesBtnArrow: {
    fontSize: 20,
    color: C.textDim,
    fontWeight: '300',
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
    backgroundColor: goldAlpha(0.08),
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
    backgroundColor: goldAlpha(0.04),
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

  // Legal section
  legalSection: {
    marginBottom: 24,
  },
  legalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  legalLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  legalLabelText: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: C.textMuted,
    fontWeight: '400',
  },
  legalCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.borderPurple,
    overflow: 'hidden',
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  legalRowText: {
    fontSize: 14,
    color: C.textMid,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  legalRowArrow: {
    fontSize: 20,
    color: C.textDim,
    fontWeight: '300',
  },
  legalDivider: {
    height: 1,
    backgroundColor: C.borderPurple,
    marginHorizontal: 18,
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

  // Admin badge (in header, next to status pill)
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    backgroundColor: goldAlpha(0.12),
    borderWidth: 1,
    borderColor: C.goldBright,
    borderRadius: 99,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  adminBadgeStar: {
    fontSize: 11,
    color: C.goldBright,
    lineHeight: 14,
  },
  adminBadgeText: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: C.goldBright,
    fontWeight: '700',
  },

  // Admin section (above Legal)
  adminSection: {
    marginBottom: 24,
    gap: 12,
  },
  adminSectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  adminSectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderGold,
  },
  adminSectionLabelText: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: C.goldBright,
    fontWeight: '500',
  },
  adminPractitionerBtn: {
    backgroundColor: goldAlpha(0.10),
    borderWidth: 1,
    borderColor: C.goldBright,
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: C.goldBright,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  adminPractitionerBtnText: {
    color: C.goldBright,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  adminDashBtn: {
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  adminDashBtnText: {
    color: C.textMid,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
  },

  // Preview Onboarding — TEMP dev tool, admin-only
  previewOnboardingBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.textDim,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  previewOnboardingBtnText: {
    color: C.textDim,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
  },

  // Notifications section
  notifSection: {
    marginBottom: 24,
    gap: 12,
  },
  notifCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: C.borderPurple,
  },
  notifToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  notifToggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textBright,
    marginBottom: 4,
  },
  notifToggleSubtitle: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '300',
    lineHeight: 17,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  presetPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.borderPurple,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  presetPillActive: {
    borderColor: C.goldBright,
    backgroundColor: goldAlpha(0.10),
  },
  presetPillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textMid,
    marginBottom: 2,
  },
  presetPillLabelActive: {
    color: C.goldBright,
  },
  presetPillTime: {
    fontSize: 11,
    fontWeight: '300',
    color: C.textDim,
  },
  presetPillTimeActive: {
    color: C.goldMid,
  },

  // Admin info card (email + sign out)
  adminInfoCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: C.borderGold,
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  adminEmailLabel: {
    fontSize: 9,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '400',
  },
  adminEmail: {
    fontSize: 15,
    color: C.textBright,
    fontWeight: '400',
    marginBottom: 16,
  },
  signOutBtn: {
    borderWidth: 1,
    borderColor: 'rgba(220, 80, 80, 0.4)',
    borderRadius: 99,
    paddingVertical: 13,
    paddingHorizontal: 36,
    backgroundColor: 'rgba(220, 80, 80, 0.08)',
  },
  signOutBtnText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
});