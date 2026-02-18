// =======================================
// SCREEN: Categories
// Purpose: Display all main healing categories
// Notes:
// - Currently uses static data (UI-only)
// - Will later load categories from backend (Firestore)
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { usePlayer } from '@/context/PlayerContext';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/* ---------------------------------------
   SECTION B — Types
---------------------------------------- */
type Category = {
  id: string;
  title: string;
  description: string;
};

/* ---------------------------------------
   SECTION C — Data Source
   - STATIC categories for now
   - Later: replace with Firestore query
---------------------------------------- */
const CATEGORIES: Category[] = [
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Slow frequencies for rest and deep sleep',
  },
  {
    id: 'calm',
    title: 'Calm',
    description: 'Relaxing sounds to ease the mind',
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Frequencies to support concentration',
  },
  {
    id: 'energy',
    title: 'Energy',
    description: 'Uplifting tones for alertness',
  },
];

/* ---------------------------------------
   SECTION D — Screen Component
---------------------------------------- */
export default function CategoriesScreen() {

  /* -------------------------------------
     SECTION D1 — Global State
     - Used to remember last selected category
  -------------------------------------- */
  const { setLastCategory } = usePlayer();

  /* -------------------------------------
     SECTION D2 — UI Layout
  -------------------------------------- */
  return (
    <View style={styles.container}>

      {/* SECTION E — Screen Title */}
      <Text style={styles.title}>Select a Category</Text>

      {/* SECTION F — Category Cards List */}
      {CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={{
            pathname: '/test',
            params: {
              title: category.title,
              description: category.description,
              sound: category.id,
            },
          }}
          asChild
        >
          <Pressable
            style={styles.categoryBox}
            onPress={() => setLastCategory(category.title)}
            accessibilityRole="button"
            accessibilityLabel={`${category.title}. ${category.description}`}
          >
            <Text style={styles.categoryText}>{category.title}</Text>
            <Text style={styles.categoryDescription}>
              {category.description}
            </Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

/* ---------------------------------------
   SECTION G — Styles
---------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#F8F6FF',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 30,
    textAlign: 'center',
  },

  categoryBox: {
    backgroundColor: '#FFF',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
    marginBottom: 4,
  },

  categoryDescription: {
    fontSize: 14,
    color: '#555',
  },
});