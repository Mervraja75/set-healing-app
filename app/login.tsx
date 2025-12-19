// -------------------------------
// Imports
// -------------------------------

// Expo Router navigation
import { Link, useRouter } from 'expo-router';

// useState: manages form field values inside the component
import { useState } from 'react';

// Core React Native components
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Login Screen Component
// -------------------------------
export default function LoginScreen() {

  // -------------------------------
  // Router
  // -------------------------------
  const router = useRouter();

  // -------------------------------
  // State (form fields)
  // -------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleLogin = () => {
    // Temporary login (no auth yet)
    router.replace('/(tabs)');
  };

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <View style={styles.container}>

      {/* App Title */}
      <Text style={styles.title}>Healing Frequency</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Relax • Focus • Breathe
      </Text>

      {/* Email field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      {/* Password field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Navigation to Register */}
      <Link href="/register" asChild>
        <Text style={styles.registerLink}>
          Don’t have an account? Create one →
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
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8F6FF',
  },
  title: {
    fontSize: 30,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3A0CA3',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5A189A',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#5A189A',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 25,
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 16,
  },
});
