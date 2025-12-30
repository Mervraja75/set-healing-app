// -------------------------------
// Imports
// -------------------------------
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// -------------------------------
// Register Screen Component
// -------------------------------
export default function RegisterScreen() {

  // -------------------------------
  // State (form fields)
  // -------------------------------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // -------------------------------
  // Handlers (pre-auth)
  // -------------------------------
  const handleRegister = () => {
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  // -------------------------------
  // UI Layout
  // -------------------------------
  return (
    <View style={styles.container}>

      {/* Screen Title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Start your healing journey
      </Text>

      {/* Full Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        onChangeText={setName}
        value={name}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigation back to Login */}
      <Link href="/login" asChild>
        <Text style={styles.loginLink}>
          Already have an account? Login →
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
  loginLink: {
    marginTop: 25,
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 16,
  },
});
