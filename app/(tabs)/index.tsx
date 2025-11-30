import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healing Frequency App</Text>
      <Text style={styles.subtitle}>Day 2 — First Screen</Text>

      <Text style={styles.welcome}>
        Welcome to your healing journey.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3A0CA3',
  },
  subtitle: {
    fontSize: 18,
    color: '#5A189A',
  },
  welcome: {
    marginTop: 20,
    fontSize: 16,
    color: '#9D4EDD',
    textAlign: 'center',
  },
});