// -------------------------------
// Imports
// -------------------------------
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Home Screen Component
// -------------------------------
export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Healing Frequency</Text>
        <Text style={styles.subtitle}>Calm • Focus • Relax</Text>
      </View>

      {/* Prompt */}
      <Text style={styles.prompt}>
        What do you need right now?
      </Text>

      {/* Quick Action Cards */}
      <View style={styles.cardContainer}>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: 'Sleep',
              description: 'Slow frequencies for deep rest',
              sound: 'sleep',
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Sleep</Text>
            <Text style={styles.cardText}>Wind down & rest</Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: 'Focus',
              description: 'Frequencies for concentration',
              sound: 'focus',
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Focus</Text>
            <Text style={styles.cardText}>Stay present</Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: 'Calm',
              description: 'Relaxing sounds for peace',
              sound: 'calm',
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Calm</Text>
            <Text style={styles.cardText}>Ease your mind</Text>
          </TouchableOpacity>
        </Link>

      </View>

      {/* Secondary Navigation */}
      <Link href="/categories" asChild>
        <Text style={styles.secondaryAction}>
          Browse all categories →
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
    paddingTop: 90,
    paddingHorizontal: 24,
    backgroundColor: '#F8F6FF',
  },

  header: {
    alignItems: 'center',
    marginBottom: 36,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    color: '#5A189A',
  },

  prompt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A0CA3',
    marginBottom: 20,
    textAlign: 'center',
  },

  cardContainer: {
    gap: 16,
    marginBottom: 32,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E6DCF7',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
    marginBottom: 4,
  },

  cardText: {
    fontSize: 14,
    color: '#555',
  },

  secondaryAction: {
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 16,
    fontWeight: '500',
  },
});
