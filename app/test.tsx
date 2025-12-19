// =======================================
// THIS IS THE SANDBOX SCREEN
// A PLACE TO TEST OUT NEW COMPONENTS
// EXPERIMENTAL FILE W/O TOUCHING THE APP
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
// Export (Test Screen Component)
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
      require('../assets/sounds/test-tone.mp3')
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

      {/* Screen Title */}
      <Text style={styles.title}>Test Screen</Text>

      {/* Info Message */}
      <Text style={styles.info}>
        Sandbox for testing components & audio
      </Text>

      {/* Play / Stop Button */}
      <TouchableOpacity style={styles.button} onPress={handleSoundToggle}>
        <Text style={styles.buttonText}>
          {isPlaying ? 'Stop Sound' : 'Play Sound'}
        </Text>
      </TouchableOpacity>

      {/* Back Navigation */}
      <Link href="/" asChild>
        <Text style={styles.back}>Go Back Home</Text>
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
  },

  // Screen Title
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3A0CA3',
    marginBottom: 10,
  },

  // Info Text
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },

  // Play / Stop Button
  button: {
    backgroundColor: '#5A189A',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Go Back Link
  back: {
    marginTop: 30,
    fontSize: 16,
    color: '#3A0CA3',
    textAlign: 'center',
  },

});
