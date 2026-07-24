// =======================================
// SCREEN: Login (app/login.tsx)
// Day 95 — Apple Sign In + Google Sign In
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link, useRouter } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { signInWithApple, signInWithGoogle } from '@/services/AuthService';
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
  goldMid:      GOLD,

  textBright:   '#FFFFFF',
  textMid:      '#DDD0FF',
  textMuted:    '#B09ACC',
  textDim:      '#7A60A0',

  borderGold:   goldAlpha(0.15),
  borderPurple: 'rgba(180, 140, 255, 0.10)',
  borderInput:  'rgba(180, 140, 255, 0.20)',

  glowGold:     goldAlpha(0.08),
  glowPurple:   'rgba(100, 50, 180, 0.18)',
};

/* ---------------------------------------
   SECTION B — Component
---------------------------------------- */
export default function LoginScreen() {
  const router  = useRouter();
  const authCtx = useAuth();

  // Email form state (unchanged)
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [focused,  setFocused]  = useState<'email' | 'password' | null>(null);

  // Social auth state
  const [loadingEmail,  setLoadingEmail]  = useState(false);
  const [loadingApple,  setLoadingApple]  = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  /* ── Email / password sign-in via Firebase Auth ── */
  const handleLogin = async () => {
    try {
      setError(null);
      setLoadingEmail(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged in AuthContext handles setUser + role fetch
      router.replace('/(tabs)');
    } catch (e: any) {
      switch (e?.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Sign in failed. Please try again.');
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  /* ── Apple Sign In ── */
  const handleAppleSignIn = async () => {
    try {
      setLoadingApple(true);
      setError(null);
      const result = await signInWithApple();
      authCtx.login(result.user.email ?? '');
      router.replace('/(tabs)');
    } catch (e: any) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') {
        setError('Apple Sign In failed. Please try again.');
      }
    } finally {
      setLoadingApple(false);
    }
  };

  /* ── Google Sign In ── */
  const handleGoogleSignIn = async () => {
    try {
      setLoadingGoogle(true);
      setError(null);
      const result = await signInWithGoogle();
      authCtx.login(result.user.email ?? '');
      router.replace('/(tabs)');
    } catch (e: any) {
      const cancelled =
        e?.code === 'SIGN_IN_CANCELLED' || e?.code === 'ERR_REQUEST_CANCELED';
      if (!cancelled) {
        setError('Google Sign In failed. Please try again.');
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  const anyLoading = loadingEmail || loadingApple || loadingGoogle;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Ambient glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.topBar}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Logo / wordmark ── */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoMark}>SET</Text>
          <Text style={styles.logoSub}>Healing</Text>
          <Text style={styles.logoTagline}>Sound · Energy · Therapy</Text>
        </View>

        <View style={styles.goldRule} />

        {/* ── Social sign-in section ── */}

        {/* Error message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Apple — iOS only */}
        {Platform.OS === 'ios' && (
          <View
            style={[styles.appleBtnWrap, loadingApple && styles.btnDimmed]}
            pointerEvents={anyLoading ? 'none' : 'auto'}
          >
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={99}
              style={styles.appleBtn}
              onPress={handleAppleSignIn}
            />
          </View>
        )}

        {/* Google */}
        <TouchableOpacity
          style={[styles.googleBtn, loadingGoogle && styles.btnDimmed]}
          onPress={handleGoogleSignIn}
          disabled={anyLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.googleLogo}>G</Text>
          <Text style={styles.googleBtnText}>
            {loadingGoogle ? 'Signing in…' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>

        {/* Divider — or continue with email */}
        <View style={styles.socialDividerRow}>
          <View style={styles.socialDividerLine} />
          <Text style={styles.socialDividerText}>or continue with email</Text>
          <View style={styles.socialDividerLine} />
        </View>

        {/* ── Form card (unchanged) ── */}
        <View style={styles.formCard}>
          <View style={styles.formCardGlow} />

          <Text style={styles.formTitle}>Welcome back</Text>
          <Text style={styles.formSubtitle}>
            Sign in to continue your healing journey
          </Text>

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focused === 'email' && styles.inputFocused,
              ]}
              placeholder="your@email.com"
              placeholderTextColor={C.textDim}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              value={email}
            />
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={[
                styles.input,
                focused === 'password' && styles.inputFocused,
              ]}
              placeholder="••••••••"
              placeholderTextColor={C.textDim}
              secureTextEntry
              onChangeText={setPassword}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              value={password}
            />
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginBtn, loadingEmail && styles.btnDimmed]}
            onPress={handleLogin}
            disabled={anyLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>
              {loadingEmail ? 'Signing in…' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register link */}
          <Link href="/register" asChild>
            <TouchableOpacity style={styles.registerBtn} activeOpacity={0.75}>
              <Text style={styles.registerBtnText}>
                Create an account
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Sound Energy Therapy · Healing Through Frequency
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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

  // ScrollView content
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingTop: 60,
    paddingBottom: 24,
  },

  // Logo
  logoWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoMark: {
    fontSize: 56,
    fontWeight: '800',
    color: C.goldBright,
    letterSpacing: -1,
    lineHeight: 58,
  },
  logoSub: {
    fontSize: 14,
    letterSpacing: 8,
    textTransform: 'uppercase',
    color: C.textMid,
    fontWeight: '300',
    marginBottom: 6,
  },
  logoTagline: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '300',
  },

  goldRule: {
    height: 1,
    backgroundColor: C.borderGold,
    marginVertical: 20,
    marginHorizontal: 20,
  },

  // ── Social sign-in ──────────────────

  // Error
  errorBox: {
    backgroundColor: 'rgba(220, 50, 50, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(220, 50, 50, 0.25)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Shared dimming for loading state
  btnDimmed: {
    opacity: 0.5,
  },

  // Apple (iOS native button)
  appleBtnWrap: {
    marginBottom: 12,
  },
  appleBtn: {
    height: 52,
    width: '100%',
  },

  // Google
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  googleLogo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
    lineHeight: 22,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1F1F',
    letterSpacing: 0.2,
  },

  // "or continue with email" divider
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  socialDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  socialDividerText: {
    fontSize: 10,
    color: C.textDim,
    letterSpacing: 1,
    fontWeight: '300',
  },

  // ── Form card (unchanged) ───────────

  formCard: {
    backgroundColor: C.bgCardDeep,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: C.borderGold,
    overflow: 'hidden',
    marginBottom: 24,
  },
  formCardGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: goldAlpha(0.06),
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.textBright,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 13,
    color: C.textMid,
    fontWeight: '300',
    marginBottom: 24,
    lineHeight: 19,
  },

  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: C.textMuted,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: C.borderInput,
    borderRadius: 14,
    paddingHorizontal: 18,
    backgroundColor: C.bgHero,
    color: C.textBright,
    fontSize: 15,
    fontWeight: '300',
  },
  inputFocused: {
    borderColor: C.borderGold,
    backgroundColor: '#311260',
  },

  // Login button
  loginBtn: {
    backgroundColor: C.goldBright,
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: C.goldBright,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  loginBtnText: {
    color: C.bg,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // Divider (inside form card)
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderPurple,
  },
  dividerText: {
    fontSize: 11,
    color: C.textDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Register button
  registerBtn: {
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: goldAlpha(0.04),
  },
  registerBtnText: {
    color: C.goldBright,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: C.textDim,
    fontWeight: '300',
  },
});
