// -------------------------------
// Imports
// -------------------------------
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Categories Screen Component
// -------------------------------
export default function CategoriesScreen() {

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <>
      {/* Main layout container */}
      <View style={styles.container}>

        {/* Screen Title */}
        <Text style={styles.title}>Select a Category</Text>

        {/* Placeholder categories */}
        <TouchableOpacity style={styles.categoryBox}>
          <Text style={styles.categoryText}>Headache Relief</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Text style={styles.categoryText}>Stomach Pain</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Text style={styles.categoryText}>Anxiety / Stress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox}>
          <Text style={styles.categoryText}>Back Pain</Text>
        </TouchableOpacity>

        {/* Back Navigation */}
        <Link href="/login" asChild>
          <Text style={styles.back}>← Back to Login</Text>
        </Link>

      </View>
    </>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,                     // Full height
    paddingTop: 80,              // Space from top
    paddingHorizontal: 20,       // Side padding
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
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  categoryText: {
    fontSize: 18,
    color: '#5A189A',
  },
  back: {
    marginTop: 30,
    fontSize: 16,
    color: '#5A189A',
    textAlign: 'center',
  },
});