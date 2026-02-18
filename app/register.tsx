// =======================================
// SCREEN: Register
// Purpose: UI-only registration form (no real auth yet)
// Notes:
// - Currently logs form values to console
// - Later: Replace handleRegister() with real signup + navigation
// =======================================

/* ---------------------------------------
   SECTION A — Imports
   ✅ Add/remove dependencies here
---------------------------------------- */
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';


/* ---------------------------------------
   SECTION B — Component
---------------------------------------- */

export default function RegisterScreen() {

  /* -------------------------------------
     SECTION B1 — Navigation + Context
     ✅ Router navigation + auth context live here
  -------------------------------------- */
  const router = useRouter();
  const auth = useAuth();

  /* -------------------------------------
     SECTION B1 — Local State (form fields)
     ✅ Add more fields here later:
     - confirmPassword
     - phone
     - termsAccepted
  -------------------------------------- */

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canRegister = name.trim() !== '' && email.trim() !== '' && password.trim() !== '';

  /* -------------------------------------
     SECTION B2 — Handlers / Actions (pre-auth)
     ✅ Later: replace with real signup (Firebase/Supabase)
     ✅ Add validation here (required fields, email format, etc.)
  -------------------------------------- */
  const handleRegister = () => {
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);

    // Later:
    // - call signup()
    // - set auth state in AuthContext
    // - router.replace('/(tabs)')
  };

  /* -------------------------------------
     SECTION C — UI Layout
     ✅ Most UI edits happen here (labels, fields, buttons)
  -------------------------------------- */
  return (
    <View style={styles.container}>
      {/* SECTION C1 — Header */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start your healing journey</Text>

      {/* SECTION C2 — Form Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        onChangeText={setName}
        value={name}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* SECTION C3 — Primary Action */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !canRegister && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={!canRegister}
      ></TouchableOpacity>

      {/* SECTION C4 — Secondary Navigation */}
      <Link href="/login" asChild>
        <Text style={styles.loginLink}>Already have an account? Login →</Text>
      </Link>
    </View>
  );
}

/* ---------------------------------------
   SECTION D — Styles
   ✅ Style tweaks live here
---------------------------------------- */
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