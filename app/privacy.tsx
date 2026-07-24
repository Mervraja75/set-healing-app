// =======================================
// SCREEN: Privacy Policy (app/privacy.tsx)
// Day 96 — App Store legal requirement
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { useRouter } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
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
  bg:           '#0A0616',
  bgCardDeep:   '#160A28',
  bgHero:       '#1E0A3C',

  goldBright:   GOLD,

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   goldAlpha(0.15),
  borderPurple: 'rgba(180, 140, 255, 0.10)',
};

/* ---------------------------------------
   SECTION DATA
---------------------------------------- */
const SECTIONS = [
  {
    title: 'Information We Collect',
    body: 'SET Healing collects information you provide when creating an account, including your name and email address. We also collect usage data such as the sessions you play, your preferences, and in-app interactions in order to improve your experience.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We use your information to provide and personalise the SET Healing experience, process subscriptions, send service communications, and improve our app. We do not sell your personal information to third parties.',
  },
  {
    title: 'Data Storage',
    body: 'Your data is stored securely using Firebase (Google Cloud). Account information is encrypted in transit and at rest. You may request deletion of your account and all associated data at any time by contacting us at the address below.',
  },
  {
    title: 'Third Party Services',
    body: 'SET Healing uses the following third-party services, each governed by their own privacy policies:\n\n• Firebase (Google) — authentication and data storage\n• Apple Sign In — optional iOS authentication\n• RevenueCat — subscription management',
  },
  {
    title: "Children's Privacy",
    body: 'SET Healing is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will take steps to remove that information.',
  },
  {
    title: 'Health & Wellness Disclaimer',
    body: 'SET Healing is intended for general wellness and relaxation purposes only. The frequencies, meditations, breathwork techniques, and other content provided in this app are not medical treatments and should not be used as a substitute for professional medical advice, diagnosis, or treatment. If you have a medical condition, please consult your healthcare provider before using this app.',
  },
  {
    title: 'Contact Us',
    body: 'SET Healing Sanctuary\n10405 N Scottsdale Rd Suite 5\nScottsdale, AZ 85253\nsethealing.com',
  },
];

/* ---------------------------------------
   COMPONENT
---------------------------------------- */
export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* ── Brand header ── */}
      <View style={styles.header}>
        <Text style={styles.logoMark}>SET</Text>
        <Text style={styles.logoSub}>Healing</Text>
        <View style={styles.goldRule} />
        <Text style={styles.pageTitle}>Privacy Policy</Text>
        <Text style={styles.effectiveDate}>Effective: June 2025</Text>
      </View>

      {/* ── Intro ── */}
      <View style={styles.introCard}>
        <Text style={styles.introText}>
          SET Healing Sanctuary ("we", "our", or "us") is committed to protecting your privacy.
          This policy explains how we collect, use, and safeguard information when you use the
          SET Healing app.
        </Text>
      </View>

      {/* ── Sections ── */}
      {SECTIONS.map((section, i) => (
        <View key={i} style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>SET Healing Sanctuary · sethealing.com</Text>
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
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },

  // Top bar
  topBar: {
    paddingTop: 60,
    marginBottom: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    color: C.textMuted,
    fontWeight: '400',
    letterSpacing: 0.3,
  },

  // Brand header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoMark: {
    fontSize: 36,
    fontWeight: '800',
    color: C.goldBright,
    letterSpacing: -1,
    lineHeight: 38,
  },
  logoSub: {
    fontSize: 11,
    letterSpacing: 6,
    textTransform: 'uppercase',
    color: C.textMuted,
    fontWeight: '300',
    marginBottom: 16,
  },
  goldRule: {
    width: 48,
    height: 1,
    backgroundColor: C.borderGold,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  effectiveDate: {
    fontSize: 11,
    color: C.textDim,
    fontWeight: '300',
    letterSpacing: 1,
  },

  // Intro card
  introCard: {
    backgroundColor: C.bgHero,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: C.borderGold,
    marginBottom: 20,
  },
  introText: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 21,
  },

  // Sections
  section: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: C.borderPurple,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: C.goldBright,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  sectionBody: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '300',
    lineHeight: 21,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    marginHorizontal: 10,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  footerText: {
    fontSize: 9,
    color: C.textDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '300',
    textAlign: 'center',
  },
});
