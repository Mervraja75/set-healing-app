// =======================================
// ROOT LAYOUT (_layout.tsx)
// Purpose:
// - Wraps the entire app
// - Registers global providers
// - Defines root stack navigation
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

/* ---------------------------------------
   SECTION B — Root Layout Component
---------------------------------------- */
export default function RootLayout() {

  /* -------------------------------------
     SECTION B1 — Theme / Color Scheme
     - Controls light/dark navigation theme
  -------------------------------------- */
  const colorScheme = useColorScheme();

  /* -------------------------------------
     SECTION B2 — App Providers + Stack
     ---------------------------------- */
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      {/* ---------------------------------
         SECTION C — Global Providers
         - AuthProvider: guest / login state
         - PlayerProvider: playback UI state
         --------------------------------- */}
      <AuthProvider>
        <PlayerProvider>

          {/* ---------------------------------
             SECTION D — Root Stack Navigator
             --------------------------------- */}
          <Stack
            initialRouteName="(tabs)"
            screenOptions={{
              headerBackTitle: 'Back', // default back label
            }}
          >

            {/* -------------------------------
               SECTION D1 — Main App (Tabs)
               - Bottom tab navigation
               ------------------------------- */}
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />

            {/* -------------------------------
               SECTION D2 — Auth Screens
               - Opened from Profile tab
               ------------------------------- */}
            <Stack.Screen
              name="login"
              options={{ title: 'Login' }}
            />
            <Stack.Screen
              name="register"
              options={{ title: 'Register' }}
            />

            {/* -------------------------------
               SECTION D3 — Content Screens
               - Opened from Home / Healing
               ------------------------------- */}
            <Stack.Screen
              name="categories"
              options={{ title: 'Categories' }}
            />
            <Stack.Screen
              name="test"
              options={{ title: 'Player' }}
            />

            {/* -------------------------------
               SECTION D4 — Paywall
               - UI only (no real payments yet)
               ------------------------------- */}
            <Stack.Screen
              name="paywall"
              options={{ title: 'Upgrade to Pro' }}
            />

          </Stack>
        </PlayerProvider>
      </AuthProvider>

      {/* ---------------------------------
         SECTION E — Status Bar
         --------------------------------- */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}