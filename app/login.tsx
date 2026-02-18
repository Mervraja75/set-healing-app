// =======================================
// SCREEN: Login
// Purpose: UI-only login form
// Notes:
// - Currently navigates straight to /(tabs)
// - Later: Replace handleLogin() with real auth (Firebase, Supabase, etc.)
// =======================================

/* ---------------------------------------
   SECTION A — Imports
   ✅ Add/remove dependencies here
---------------------------------------- */

// Expo Router navigation
import { Link, useRouter } from 'expo-router';

// React state
import { useState } from 'react';

// Core React Native components
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Context (for later auth state management)
import { useAuth } from '@/context/AuthContext';

/* ---------------------------------------
   SECTION B — Component
---------------------------------------- */
export default function LoginScreen() {
  /* -------------------------------------
     SECTION B1 — Navigation
     ✅ Router navigation actions live here
  -------------------------------------- */
  const router = useRouter();
  const auth = useAuth();

  /* -------------------------------------
     SECTION B2 — Local State (form fields)
     ✅ Add more form fields here later (remember me, etc.)
  -------------------------------------- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* -------------------------------------
     SECTION B3 — Handlers / Actions
     ✅ Add validation + auth logic here later
  -------------------------------------- */
  const handleLogin = () => {
    // Temporary login (no auth yet)
    // Later: replace with Firebase/Supabase login call
    auth.login(email.trim());
    router.replace('/(tabs)');
  };

  /* -------------------------------------
     SECTION C — UI Layout
     ✅ Most UI edits happen here (text, buttons, layout)
  -------------------------------------- */
  return (
    <View style={styles.container}>
      {/* SECTION C1 — Header */}
      <Text style={styles.title}>Healing Frequency</Text>
      <Text style={styles.subtitle}>Relax • Focus • Breathe</Text>

      {/* SECTION C2 — Form Inputs */}
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* SECTION C4 — Secondary Navigation */}
      <Link href="/register" asChild>
        <Text style={styles.registerLink}>
          Don’t have an account? Create one →
        </Text>
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
  registerLink: {
    marginTop: 25,
    textAlign: 'center',
    color: '#5A189A',
    fontSize: 16,
  },
});