// =======================================
// SCREEN: Register (app/register.tsx)
// Theme: SET Healing — Royal Purple & Sacred Gold
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link, useRouter } from 'expo-router';
import { GOLD, goldAlpha } from '@/constants/Colors';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
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
   SECTION B1 — Firebase error helper
---------------------------------------- */
function firebaseErrorMessage(code: string | undefined): string {
  switch (code) {
    case 'auth/email-already-in-use':   return 'That email is already registered. Try signing in instead.';
    case 'auth/invalid-email':           return 'Please enter a valid email address.';
    case 'auth/weak-password':           return 'Password must be at least 6 characters.';
    case 'auth/network-request-failed':  return 'Network error. Check your connection and try again.';
    default:                             return 'Something went wrong. Please try again.';
  }
}

/* ---------------------------------------
   SECTION B — Component
---------------------------------------- */
export default function RegisterScreen() {
  const router  = useRouter();
  const authCtx = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [focused,  setFocused]  = useState<'name' | 'email' | 'password' | null>(null);
  const [loading,  setLoading]  = useState(false);

  const canRegister =
    name.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '';

  const handleRegister = async () => {
    console.log('[Register] handleRegister called', { email: email.trim(), hasPassword: !!password });
    if (!canRegister) return;

    setLoading(true);
    try {
      console.log('[Register] Calling createUserWithEmailAndPassword...');
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('[Register] Account created successfully — navigating to tabs');
      authCtx.register(name.trim(), email.trim());
      router.replace('/(tabs)');
    } catch (e: any) {
      console.log('[Register] Error:', e?.code, e?.message);
      const msg = firebaseErrorMessage(e?.code);
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

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

      <View style={styles.container}>

        {/* ── Logo / wordmark ── */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoMark}>SET</Text>
          <Text style={styles.logoSub}>Healing</Text>
          <Text style={styles.logoTagline}>Sound · Energy · Therapy</Text>
        </View>

        <View style={styles.goldRule} />

        {/* ── Form card ── */}
        <View style={styles.formCard}>
          <View style={styles.formCardGlow} />

          <Text style={styles.formTitle}>Begin your journey</Text>
          <Text style={styles.formSubtitle}>
            Create your account to access healing sessions
          </Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, focused === 'name' && styles.inputFocused]}
              placeholder="Your name"
              placeholderTextColor={C.textDim}
              onChangeText={setName}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              value={name}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, focused === 'email' && styles.inputFocused]}
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

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={[styles.input, focused === 'password' && styles.inputFocused]}
              placeholder="••••••••"
              placeholderTextColor={C.textDim}
              secureTextEntry
              onChangeText={setPassword}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              value={password}
            />
          </View>

          {/* Register button */}
          <TouchableOpacity
            style={[styles.registerBtn, (!canRegister || loading) && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={!canRegister || loading}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login link */}
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.75}>
              <Text style={styles.loginBtnText}>
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Sound Energy Therapy · Healing Through Frequency
        </Text>

      </View>
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

  glowTop: {
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: C.glowPurple,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: C.glowGold,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
  },

  // Logo
  logoWrap: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginVertical: 24,
    marginHorizontal: 20,
  },

  // Form card
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
    left: -60,
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

  // Register button
  registerBtn: {
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
  registerBtnDisabled: {
    opacity: 0.45,
  },
  registerBtnText: {
    color: C.bg,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // Divider
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

  // Login link
  loginBtn: {
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: goldAlpha(0.04),
  },
  loginBtnText: {
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