// =======================================
// SCREEN: Terms of Service (app/terms.tsx)
// Day 96 — App Store legal requirement
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

import { useRouter } from 'expo-router';
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
  bgWarning:    'rgba(220, 150, 40, 0.08)',

  goldBright:   '#C9A84C',

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   'rgba(201, 168, 76, 0.15)',
  borderPurple: 'rgba(180, 140, 255, 0.10)',
  borderWarning:'rgba(220, 150, 40, 0.25)',
};

/* ---------------------------------------
   SECTION DATA
---------------------------------------- */
const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: 'By downloading or using the SET Healing app, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the app.',
    warning: false,
  },
  {
    title: 'Use of App',
    body: 'You may use SET Healing for personal, non-commercial wellness purposes only. You agree not to reproduce, redistribute, or modify any content without written permission. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.',
    warning: false,
  },
  {
    title: 'Health Disclaimer',
    body: 'SET Healing is a wellness and sound therapy app designed for relaxation and general well-being. The content — including sound frequencies, meditations, breathwork, and affirmations — is for wellness purposes only.\n\nSET Healing is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before beginning any wellness programme, particularly if you have a medical condition, are pregnant, or have a history of seizures or mental health conditions.\n\nDo not disregard or delay seeking professional medical advice because of something you heard, experienced, or read in this app.',
    warning: true,
  },
  {
    title: 'Subscriptions',
    body: 'SET Healing offers optional premium subscriptions that unlock additional content and features. Subscriptions are billed through your app store account (Apple App Store or Google Play). All purchases are subject to the payment terms of your respective app store.\n\nSubscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period. You can manage or cancel your subscription in your device\'s app store settings.',
    warning: false,
  },
  {
    title: 'Intellectual Property',
    body: 'All content within SET Healing — including sound recordings, frequency sessions, meditation scripts, breathwork guides, affirmations, and app design — is the intellectual property of SET Healing Sanctuary and is protected by copyright law.\n\nYou may not reproduce, distribute, publicly perform, or create derivative works from any content without prior written consent from SET Healing Sanctuary.',
    warning: false,
  },
  {
    title: 'Limitation of Liability',
    body: 'To the maximum extent permitted by applicable law, SET Healing Sanctuary shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the app.\n\nOur total liability to you for any claim arising from these terms or your use of the app shall not exceed the total amount paid by you to SET Healing Sanctuary in the twelve months preceding the claim.',
    warning: false,
  },
  {
    title: 'Contact Us',
    body: 'SET Healing Sanctuary\n10405 N Scottsdale Rd Suite 5\nScottsdale, AZ 85253\nsethealing.com',
    warning: false,
  },
];

/* ---------------------------------------
   COMPONENT
---------------------------------------- */
export default function TermsScreen() {
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
        <Text style={styles.pageTitle}>Terms of Service</Text>
        <Text style={styles.effectiveDate}>Effective: June 2025</Text>
      </View>

      {/* ── Intro ── */}
      <View style={styles.introCard}>
        <Text style={styles.introText}>
          These Terms of Service govern your use of the SET Healing app operated by
          SET Healing Sanctuary. Please read them carefully before using the app.
        </Text>
      </View>

      {/* ── Sections ── */}
      {SECTIONS.map((section, i) => (
        <View
          key={i}
          style={[
            styles.section,
            section.warning && styles.sectionWarning,
          ]}
        >
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionDot, section.warning && styles.sectionDotWarning]} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          {section.warning && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningBadgeText}>Important Health Notice</Text>
            </View>
          )}
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
  sectionWarning: {
    backgroundColor: C.bgWarning,
    borderColor: C.borderWarning,
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
  sectionDotWarning: {
    backgroundColor: '#E5A020',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textBright,
    letterSpacing: 0.1,
  },
  warningBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(220, 150, 40, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220, 150, 40, 0.35)',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  warningBadgeText: {
    fontSize: 9,
    color: '#E5A020',
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
