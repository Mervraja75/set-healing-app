// app/(tabs)/profile.tsx

// -------------------------------
// Imports
// -------------------------------
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Profile Screen Component
// -------------------------------
export default function ProfileScreen() {
  const { isGuest, continueAsGuest } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>
          {isGuest
            ? 'Explore as a guest, or sign in to personalize your experience.'
            : 'You’re signed in — enjoy your personalized healing experience.'}
        </Text>
      </View>

      {/* ✅ Upgrade Card (UI only) */}
      <Link href="/paywall" asChild>
        <TouchableOpacity style={styles.upgradeCard} activeOpacity={0.9}>
          <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
          <Text style={styles.upgradeText}>
            Unlock premium collections, favorites, and more.
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why create an account?</Text>
        <Text style={styles.infoText}>• Save your favorite sounds</Text>
        <Text style={styles.infoText}>• Resume your last session</Text>
        <Text style={styles.infoText}>• Track your healing habits</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Continue as Guest (show only if currently guest) */}
        {isGuest && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Continue as guest"
            style={styles.guestButton}
            onPress={continueAsGuest}
            activeOpacity={0.85}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        )}

        {/* Log in */}
        <Link href="/login" asChild>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Log in to your account"
            style={styles.primaryButton}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryText}>Log In</Text>
          </TouchableOpacity>
        </Link>

        {/* Create account */}
        <Link href="/register" asChild>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Create a new account"
            style={styles.secondaryButton}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryText}>Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer / status text */}
      <Text style={styles.footerText}>
        {isGuest ? 'Guest mode is on — you can sign in anytime.' : 'Signed in.'}
      </Text>
    </View>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 24,
    backgroundColor: '#F8F6FF',
  },

  header: {
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },

  // ✅ Upgrade Card
  upgradeCard: {
    backgroundColor: '#5A189A',
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    marginBottom: 18,
  },
  upgradeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  upgradeText: {
    color: '#E6D9FF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6DCF7',
    marginBottom: 22,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
    marginBottom: 10,
  },

  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },

  actions: {
    gap: 14,
    marginBottom: 18,
  },

  guestButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5A189A',
    paddingVertical: 14,
    borderRadius: 14,
  },

  guestButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#5A189A',
  },

  primaryButton: {
    backgroundColor: '#5A189A',
    paddingVertical: 14,
    borderRadius: 14,
  },

  primaryText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#5A189A',
  },

  secondaryText: {
    color: '#5A189A',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#777',
    marginTop: 8,
  },
});