// -------------------------------
// Imports
// -------------------------------

// Link: used for navigation between screens with Expo Router
import { Link } from 'expo-router';

// Core React Native UI components
import { StyleSheet, Text, View } from 'react-native';

// -------------------------------
// Home Screen Component
// -------------------------------
export default function HomeScreen() {

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <View style={styles.container}>  {/* Main container for layout */}

      {/* App Title */}
      <Text style={styles.title}>Healing Frequency App</Text>

      {/* Subtitle to label this as the first screen */}
      <Text style={styles.subtitle}>Day 2 — First Screen</Text>

      {/* Short welcome message for the landing page */}
      <Text style={styles.welcome}>
        Welcome to your healing journey.
      </Text>

      {/* Navigation link that routes to the Login screen */}
      <Link href="/login" asChild>
        <Text style={styles.loginLink}>Go to Login →</Text>
      </Link>

    </View>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Full height of screen
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',  // Center horizontally
    backgroundColor: '#F8F6FF',  // Light purple background
    padding: 20,  // Inner spacing
  },
  title: {
    fontSize: 28,  // Large title text
    fontWeight: 'bold',
    marginBottom: 10,  // Space below title
    color: '#3A0CA3',
  },
  subtitle: {
    fontSize: 18,
    color: '#5A189A',
  },
  welcome: {
    marginTop: 20,  // Space above paragraph
    fontSize: 16,
    color: '#9D4EDD',
    textAlign: 'center',  // Center the text
  },
  loginLink: {
    marginTop: 30,  // Space above the login link
    fontSize: 18,
    color: '#5A189A',  // Purple clickable text
  },
});