// -------------------------------
// Imports
// -------------------------------
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Mock data (Popular / Newest)
// -------------------------------
type Session = {
  id: string;
  title: string;
  description: string;
  sound: string;
  badge?: string;
};

const POPULAR: Session[] = [
  { id: 'p1', title: 'Deep Sleep', description: 'Slow frequencies for deep rest', sound: 'sleep', badge: 'Popular' },
  { id: 'p2', title: 'Focus Booster', description: 'Stay present and productive', sound: 'focus', badge: 'Top' },
];

const NEWEST: Session[] = [
  { id: 'n1', title: 'Evening Calm', description: 'Wind down after a busy day', sound: 'calm', badge: 'New' },
  { id: 'n2', title: 'Morning Clarity', description: 'Gentle tones to start your day', sound: 'focus', badge: 'New' },
];

// -------------------------------
// Small Section Header (inline)
// -------------------------------
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {/* future: See all link */}
    </View>
  );
}

// -------------------------------
// Home Screen Component
// -------------------------------
export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

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
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Sleep. Wind down and rest"
            style={styles.card}
          >
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
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Focus. Stay present"
            style={styles.card}
          >
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
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Calm. Ease your mind"
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Calm</Text>
            <Text style={styles.cardText}>Ease your mind</Text>
          </TouchableOpacity>
        </Link>

      </View>

      {/* Popular Section */}
      <SectionHeader title="Popular" />
      <View style={styles.sectionList}>
        {POPULAR.map((s) => (
          <Link
            key={s.id}
            href={{
              pathname: '/test',
              params: { title: s.title, description: s.description, sound: s.sound },
            }}
            asChild
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`${s.title}. ${s.description}`}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                {s.badge ? <Text style={styles.badge}>{s.badge}</Text> : null}
              </View>
              <Text style={styles.cardText}>{s.description}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      {/* Newest Section */}
      <SectionHeader title="Newest" />
      <View style={styles.sectionList}>
        {NEWEST.map((s) => (
          <Link
            key={s.id}
            href={{
              pathname: '/test',
              params: { title: s.title, description: s.description, sound: s.sound },
            }}
            asChild
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`${s.title}. ${s.description}`}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                {s.badge ? <Text style={styles.badge}>{s.badge}</Text> : null}
              </View>
              <Text style={styles.cardText}>{s.description}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      {/* Secondary Navigation */}
      <Link href="/categories" asChild>
        <Text style={styles.secondaryAction}>
          Browse all categories →
        </Text>
      </Link>

      {/* bottom padding so last content isn't blocked by tab bar */}
      <View style={{ height: 36 }} />

    </ScrollView>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    paddingHorizontal: 24,
    backgroundColor: '#F8F6FF',
  },

  header: {
    alignItems: 'center',
    marginBottom: 18,
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
    marginBottom: 24,
  },

  sectionHeader: {
    marginTop: 6,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A0CA3',
  },

  sectionList: {
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E6DCF7',
    marginBottom: 12,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
  },

  cardText: {
    fontSize: 14,
    color: '#555',
  },

  badge: {
    backgroundColor: '#E9D8FD',
    color: '#5A189A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
  },

  secondaryAction: {
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
});