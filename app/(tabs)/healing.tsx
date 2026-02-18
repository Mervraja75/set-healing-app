// =======================================
// SCREEN: Healing
// Purpose: Show healing collections and premium content
// Notes: Currently uses static data.
//        Later we can swap SECTION C with Firestore (backend).
// =======================================

/* ---------------------------------------
   SECTION A — Imports
   - Add/remove libraries here
---------------------------------------- */
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/* ---------------------------------------
   SECTION B — Types / Models
   - Define UI data structures here
---------------------------------------- */
type Collection = {
  id: string;
  title: string;
  description: string;
  sound: string;
  locked?: boolean;
};

/* ---------------------------------------
   SECTION C — Data Source
   - STATIC DATA for now
   - Later: replace with Firestore (backend)
---------------------------------------- */

/* SECTION C1 — Featured collection */
const FEATURED: Collection = {
  id: 'deep-sleep',
  title: 'Deep Sleep',
  description: 'Slow, grounding frequencies for deep rest and recovery',
  sound: 'sleep',
  locked: false,
};

/* SECTION C2 — Collections list (edit/add cards here) */
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
   SECTION D — Screen Component
---------------------------------------- */
export default function HealingScreen() {
  /* -------------------------------------
     SECTION D1 — State (none for now)
     - Later: add loading state + Firestore data here
  -------------------------------------- */

  /* -------------------------------------
     SECTION D2 — Handlers / Helpers
     - Navigation handled inline with <Link />
     - Later: add "handlePlay", "handleOpenPaywall" here if needed
  -------------------------------------- */

  /* -------------------------------------
     SECTION E — UI Render
  -------------------------------------- */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* SECTION E1 — Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Healing</Text>
        <Text style={styles.subtitle}>
          Curated sound collections to support your mind and body
        </Text>
      </View>

      {/* SECTION E2 — Featured Collection (Free) */}
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

      {/* SECTION E3 — Collections Title */}
      <Text style={styles.sectionTitle}>Collections</Text>

      {/* SECTION E4 — Collections List
          - Locked items -> Paywall
          - Free items -> Player
      */}
      <View style={styles.collectionList}>
        {COLLECTIONS.map((item) => {
          // SECTION E4a — Card UI block (reused for locked/free)
          const Card = (
            <View style={styles.collectionCard}>
              <View style={styles.cardRow}>
                <Text style={styles.collectionTitle}>{item.title}</Text>
                {item.locked && <Text style={styles.lock}>🔒</Text>}
              </View>
              <Text style={styles.collectionText}>{item.description}</Text>
            </View>
          );

          // SECTION E4b — Locked -> Paywall route
          if (item.locked) {
            return (
              <Link key={item.id} href="/paywall" asChild>
                <TouchableOpacity activeOpacity={0.85}>{Card}</TouchableOpacity>
              </Link>
            );
          }

          // SECTION E4c — Free -> Player route
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
              <TouchableOpacity activeOpacity={0.85}>{Card}</TouchableOpacity>
            </Link>
          );
        })}
      </View>

      {/* SECTION E5 — Spacer (prevents tab bar overlap) */}
      <View style={{ height: 36 }} />
    </ScrollView>
  );
}

/* ---------------------------------------
   SECTION F — Styles
   - All styling stays here
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