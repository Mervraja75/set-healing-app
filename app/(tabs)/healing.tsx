// -------------------------------
// Imports
// -------------------------------
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Healing Screen Component
// -------------------------------
export default function HealingScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Healing</Text>
        <Text style={styles.subtitle}>
          Curated sound collections to support your mind and body
        </Text>
      </View>

      {/* Featured Collection */}
      <View style={styles.featuredCard}>
        <Text style={styles.featuredBadge}>Featured</Text>
        <Text style={styles.featuredTitle}>Deep Sleep</Text>
        <Text style={styles.featuredText}>
          Slow, grounding frequencies for deep rest and recovery
        </Text>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: 'Deep Sleep',
              description: 'Relax into deep rest',
              sound: 'sleep',
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Play</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Collections</Text>

      {/* Collection Cards */}
      <View style={styles.collectionList}>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: 'Calm',
              description: 'Ease your thoughts and slow down',
              sound: 'calm',
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.collectionCard}>
            <Text style={styles.collectionTitle}>Calm</Text>
            <Text style={styles.collectionText}>Relax & breathe</Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: 'Focus',
              description: 'Sharpen attention and clarity',
              sound: 'focus',
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.collectionCard}>
            <Text style={styles.collectionTitle}>Focus</Text>
            <Text style={styles.collectionText}>Stay present</Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: 'Energy',
              description: 'Uplifting tones for alertness',
              sound: 'energy',
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.collectionCard}>
            <Text style={styles.collectionTitle}>Energy</Text>
            <Text style={styles.collectionText}>Recharge gently</Text>
          </TouchableOpacity>
        </Link>

      </View>

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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },

  featuredCard: {
    backgroundColor: '#5A189A',
    borderRadius: 22,
    padding: 22,
    marginBottom: 34,
  },

  featuredBadge: {
    color: '#E6D9FF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  featuredText: {
    fontSize: 14,
    color: '#E6D9FF',
    marginBottom: 18,
  },

  featuredButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  featuredButtonText: {
    color: '#5A189A',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 16,
  },

  collectionList: {
    gap: 16,
  },

  collectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E6DCF7',
  },

  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
    marginBottom: 4,
  },

  collectionText: {
    fontSize: 14,
    color: '#555',
  },
});
