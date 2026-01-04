// -------------------------------
// Imports
// -------------------------------
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Profile Screen Component
// -------------------------------
export default function ProfileScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>
          Sign in to personalize your healing experience
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why create an account?</Text>

        <Text style={styles.infoText}>• Save your favorite sounds</Text>
        <Text style={styles.infoText}>• Resume your last session</Text>
        <Text style={styles.infoText}>• Track your healing habits</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>

        <Link href="/login" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryText}>Log In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Create Account</Text>
          </TouchableOpacity>
        </Link>

      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        You can explore sounds without an account.
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
    marginBottom: 28,
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

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6DCF7',
    marginBottom: 30,
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
    marginBottom: 24,
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
  },
});
