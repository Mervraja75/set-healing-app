// -------------------------------
// Imports
// -------------------------------
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

// -------------------------------
// Home Screen Component
// -------------------------------
export default function HomeScreen() {

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <View style={styles.container}>

      {/* App Title */}
      <Text style={styles.title}>Healing Frequency</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Calm • Focus • Relax
      </Text>

      {/* Welcome message */}
      <Text style={styles.welcome}>
        Choose a sound frequency and take a moment for yourself.
      </Text>

      {/* Primary navigation */}
      <Link href="/categories" asChild>
        <Text style={styles.primaryAction}>
          Explore Categories →
        </Text>
      </Link>

    </View>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#3A0CA3',
  },
  subtitle: {
    fontSize: 16,
    color: '#5A189A',
    marginBottom: 24,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  primaryAction: {
    backgroundColor: '#5A189A',
    color: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});
