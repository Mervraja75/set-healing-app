// =======================================
// SCREEN: Healing
// Purpose: Show healing collections and premium content
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/* ---------------------------------------
   SECTION B — Types
---------------------------------------- */
type Collection = {
  id: string;
  title: string;
  description: string;
  sound: string;
  locked?: boolean;
};

/* ---------------------------------------
   SECTION C — Static Data
   ✅ Edit collections here
---------------------------------------- */
const FEATURED: Collection = {
  id: 'deep-sleep',
  title: 'Deep Sleep',
  description: 'Slow, grounding frequencies for deep rest and recovery',
  sound: 'sleep',
  locked: false,
};

const COLLECTIONS: Collection[] = [
  {
    id: 'calm',
    title: 'Calm',
    description: 'Ease your thoughts and slow down',
    sound: 'calm',
    locked: false,
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Sharpen attention and clarity',
    sound: 'focus',
    locked: true, // 🔒 premium
  },
  {
    id: 'energy',
    title: 'Energy',
    description: 'Uplifting tones for alertness',
    sound: 'energy',
    locked: true, // 🔒 premium
  },
];

/* ---------------------------------------
   SECTION D — Component
---------------------------------------- */
export default function HealingScreen() {

  /* -------------------------------------
     SECTION D1 — Handlers
     ---------------------------------- */
  // (Navigation handled inline via <Link /> for now)

  /* -------------------------------------
     SECTION E — UI Layout
     ---------------------------------- */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Healing</Text>
        <Text style={styles.subtitle}>
          Curated sound collections to support your mind and body
        </Text>
      </View>

      {/* Featured Collection (Free) */}
      <View style={styles.featuredCard}>
        <Text style={styles.featuredBadge}>Featured</Text>
        <Text style={styles.featuredTitle}>{FEATURED.title}</Text>
        <Text style={styles.featuredText}>{FEATURED.description}</Text>

        <Link
          href={{
            pathname: '/test',
            params: {
              title: FEATURED.title,
              description: FEATURED.description,
              sound: FEATURED.sound,
            },
          }}
          asChild
        >
          <TouchableOpacity style={styles.featuredButton} activeOpacity={0.85}>
            <Text style={styles.featuredButtonText}>Play</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Collections */}
      <Text style={styles.sectionTitle}>Collections</Text>

      <View style={styles.collectionList}>
        {COLLECTIONS.map((item) => {
          const Card = (
            <View style={styles.collectionCard}>
              <View style={styles.cardRow}>
                <Text style={styles.collectionTitle}>{item.title}</Text>
                {item.locked && <Text style={styles.lock}>🔒</Text>}
              </View>
              <Text style={styles.collectionText}>{item.description}</Text>
            </View>
          );

          // Locked → Paywall
          if (item.locked) {
            return (
              <Link key={item.id} href="/paywall" asChild>
                <TouchableOpacity activeOpacity={0.85}>
                  {Card}
                </TouchableOpacity>
              </Link>
            );
          }

          // Free → Player
          return (
            <Link
              key={item.id}
              href={{
                pathname: '/test',
                params: {
                  title: item.title,
                  description: item.description,
                  sound: item.sound,
                },
              }}
              asChild
            >
              <TouchableOpacity activeOpacity={0.85}>
                {Card}
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>

      {/* Spacer for tab bar */}
      <View style={{ height: 36 }} />
    </ScrollView>
  );
}

/* ---------------------------------------
   SECTION F — Styles
---------------------------------------- */
const styles = StyleSheet.create({
  container: {
    paddingTop: 90,
    paddingHorizontal: 24,
    backgroundColor: '#F8F6FF',
  },

  header: {
    alignItems: 'center',
    marginBottom: 22,
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
    marginBottom: 24,
  },

  featuredBadge: {
    color: '#E6D9FF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.8,
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
    fontWeight: '700',
    color: '#3A0CA3',
    marginBottom: 14,
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

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
  },

  collectionText: {
    fontSize: 14,
    color: '#555',
  },

  lock: {
    fontSize: 16,
  },
});