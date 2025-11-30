// -------------------------------
// Imports
// -------------------------------

// Link: used for screen navigation through Expo Router
import { Link } from 'expo-router';

// useState: manages form field values inside the component
import { useState } from 'react';

// Core React Native components for layout and UI inputs
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Login Screen Component
// -------------------------------
export default function LoginScreen() {

  // -------------------------------
  // State (form fields)
  // -------------------------------
  const [email, setEmail] = useState('');        // Stores user email input
  const [password, setPassword] = useState('');  // Stores user password input

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleLogin = () => {
    console.log('Email:', email);        // Temporary log for testing input values
    console.log('Password:', password);  // Firebase login will replace this later
  };

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <View style={styles.container}>  {/* Main screen container */}

      {/* Back navigation to the Home screen */}
      <Link href="/" asChild>
        <Text style={styles.back}>← Back</Text>
      </Link>

      {/* Screen title */}
      <Text style={styles.title}>Login</Text>

      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"       // Prevents iOS from capitalizing first letter
        onChangeText={setEmail}     // Updates email state
        value={email}               // Binds input value to state
      />

      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry             // Masks password characters
        onChangeText={setPassword}  // Updates password state
        value={password}            // Binds input value to state
      />

      {/* Login button - triggers handleLogin */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Navigation to the Register screen */}
      <Link href="/register" asChild>
        <Text style={styles.registerLink}>
          Don't have an account? Create one →
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
    flex: 1,                    // Full height of screen
    justifyContent: 'center',   // Centers content vertically
    padding: 20,                // Inner spacing around UI
    backgroundColor: '#F8F6FF', // Light background color
  },
  back: {
    fontSize: 18,       // Back text size
    color: '#5A189A',   // Purple color for navigation
    marginBottom: 20,   // Spacing below the back link
  },
  title: {
    fontSize: 28,       // Large title size
    marginBottom: 30,   // Spacing below title
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3A0CA3',   // Darker purple shade
  },
  input: {
    height: 50,               // Standard input height
    borderWidth: 1,           // Input border
    borderColor: '#DDD',      // Light gray border
    borderRadius: 10,         // Rounded corners
    marginBottom: 15,         // Spacing between inputs
    paddingHorizontal: 15,    // Inner horizontal padding
    backgroundColor: '#FFF',  // White input background
  },
  button: {
    backgroundColor: '#5A189A',  // Purple button color
    paddingVertical: 15,         // Vertical padding inside button
    borderRadius: 10,            // Rounded corners
    marginTop: 10,               // Space above the button
  },
  buttonText: {
    color: '#FFF',           // White button text
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,           // Space above the register link
    textAlign: 'center',
    color: '#5A189A',        // Purple link color
    fontSize: 16,
  },
});