// -------------------------------
// Imports
// -------------------------------

// Link: enables screen-to-screen navigation via Expo Router
import { Link } from 'expo-router';

// useState: manages local form field values
import { useState } from 'react';

// Core UI components for building the registration form
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Register Screen Component
// -------------------------------
export default function RegisterScreen() {

  // -------------------------------
  // State (form fields)
  // -------------------------------
  const [name, setName] = useState('');       // Stores full name input
  const [email, setEmail] = useState('');     // Stores email input
  const [password, setPassword] = useState(''); // Stores password input

  // -------------------------------
  // Handlers (pre-Firebase)
  // -------------------------------
  const handleRegister = () => {
    console.log("Name:", name);        // Temporary logs for testing
    console.log("Email:", email);
    console.log("Password:", password);
    // Firebase signup will be implemented on Day 7
  };

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <View style={styles.container}> {/* Main container for screen */}

      {/* Back navigation to Login screen */}
      <Link href="/login" asChild>
        <Text style={styles.back}>← Back to Login</Text>
      </Link>

      {/* Screen title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Full Name input field */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        onChangeText={setName}     // Updates full name state
        value={name}               // Binds field to state
      />

      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"      // Prevents automatic uppercase (iOS)
        onChangeText={setEmail}    // Updates email state
        value={email}              // Binds field to state
      />

      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry            // Hides password characters
        onChangeText={setPassword} // Updates password state
        value={password}           // Binds field to state
      />

      {/* Registration button - triggers handleRegister */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
}

// -------------------------------
// Styles
// -------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,                     // Full height layout
    justifyContent: 'center',    // Center vertically
    padding: 20,                 // Inner padding around form
    backgroundColor: '#F8F6FF',  // Light lavender background
  },
  back: {
    fontSize: 18,         // Size of back navigation text
    color: '#5A189A',     // Purple navigation text color
    marginBottom: 20,     // Space below back link
  },
  title: {
    fontSize: 28,         // Large screen title
    marginBottom: 30,     // Space below title
    textAlign: 'center',  // Centered title
    fontWeight: 'bold',
    color: '#3A0CA3',
  },
  input: {
    height: 50,               // Standard form input height
    borderWidth: 1,           // Light border for input field
    borderColor: '#DDD',      // Light gray border
    borderRadius: 10,         // Rounded corners
    marginBottom: 15,         // Space below each input
    paddingHorizontal: 15,    // Inner padding left/right
    backgroundColor: '#FFF',  // White input background
  },
  button: {
    backgroundColor: '#5A189A', // Purple action button
    paddingVertical: 15,        // Button height
    borderRadius: 10,           // Rounded corners
    marginTop: 10,              // Space above button
  },
  buttonText: {
    color: '#FFF',           // White text on button
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});