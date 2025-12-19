// =======================================
// PLAYER SCREEN (Day 13)
// Basic Audio Player UI
// =======================================

// -------------------------------
// Imports
// -------------------------------

// Expo Router navigation
import { Link } from 'expo-router';

// React hooks
import { useEffect, useState } from 'react';

// React Native UI components
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Expo Audio API
import { Audio } from 'expo-av';

// -------------------------------
// Player Screen Component
// -------------------------------

export default function TestScreen() {

  // -------------------------------
  // State
  // -------------------------------

  // Holds the loaded sound instance
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Track whether audio is playing
  const [isPlaying, setIsPlaying] = useState(false);

  // -------------------------------
  // Play / Stop Sound Handler
  // -------------------------------

  const handleSoundToggle = async () => {

    // If sound is already playing → stop & unload
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      return;
    }

    // Load sound file
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../assets/sounds/test.mp3')
    );

    setSound(newSound);
    setIsPlaying(true);

    // Play sound
    await newSound.playAsync();
  };

  // -------------------------------
  // Cleanup when leaving screen
  // -------------------------------

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // -------------------------------
  // UI Layout
  // -------------------------------

  return (
    <View style={styles.container}>

      {/* Category Label */}
      <Text style={styles.category}>Calm</Text>

      {/* Screen Title */}
      <Text style={styles.title}>Relaxing Frequency</Text>

      {/* Description */}
      <Text style={styles.info}>
        Take a moment to breathe and listen.
      </Text>

      {/* Play / Stop Button */}
      <TouchableOpacity style={styles.button} onPress={handleSoundToggle}>
        <Text style={styles.buttonText}>
          {isPlaying ? 'Stop' : 'Play'}
        </Text>
      </TouchableOpacity>

      {/* Back Navigation */}
      <Link href="/categories" asChild>
        <Text style={styles.back}>← Back to Categories</Text>
      </Link>

    </View>
  );
}

// -------------------------------
// Styles (UI)
// -------------------------------

const styles = StyleSheet.create({

  // Main Layout
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    padding: 24,
  },

  // Category Label
  category: {
    fontSize: 14,
    color: '#5A189A',
    marginBottom: 6,
    letterSpacing: 1,
  },

  // Screen Title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 10,
    textAlign: 'center',
  },

  // Info Text
  info: {
    fontSize: 15,
    color: '#555',
    marginBottom: 35,
    textAlign: 'center',
  },

  // Play / Stop Button
  button: {
    backgroundColor: '#5A189A',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginBottom: 30,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Back Link
  back: {
    fontSize: 16,
    color: '#5A189A',
    textAlign: 'center',
  },

});
