// -------------------------------
// Imports
// -------------------------------

// Link: used for screen navigation through Expo Router
import { Link } from 'expo-router';

// useState: manages form field values inside the component
import { useState } from 'react';

// Core React Native components
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Login Screen Component
// -------------------------------
export default function LoginScreen() {

  // -------------------------------
  // State (form fields)
  // -------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <>
      {/* Main screen container */}
      <View style={styles.container}>

        {/* Back navigation */}
        <Link href="/" asChild>
          <Text style={styles.back}>← Back</Text>
        </Link>

        {/* Screen title */}
        <Text style={styles.title}>Login</Text>

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

        {/* Navigation to Categories for testing */}
        <Link href="/categories" asChild>
          <Text style={styles.categoriesLink}>Continue to Categories →</Text>
        </Link>

        {/* Navigation to Register */}
        <Link href="/register" asChild>
          <Text style={styles.registerLink}>
            Don't have an account? Create one →
          </Text>
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
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F6FF',
  },
  back: {
    fontSize: 18,
    color: '#5A189A',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3A0CA3',
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
    marginTop: 20,
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 16,
  },
  categoriesLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 16,
  },
});