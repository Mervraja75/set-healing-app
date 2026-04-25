// =======================================
// ROOT LAYOUT (app/_layout.tsx)
// Day 57 — Performance + dark theme fixes
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';

/* ---------------------------------------
   SECTION B — Custom dark theme
   Overrides React Navigation defaults so
   our deep purple bg is never overwritten
---------------------------------------- */
const SET_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background:   '#120828',   // matches C.bg across all screens
    card:         '#1A0A2E',   // tab bar + header bg
    text:         '#FFFFFF',
    border:       'rgba(212, 168, 40, 0.15)',
    notification: '#D4A828',
    primary:      '#D4A828',
  },
};

/* ---------------------------------------
   SECTION C — Root Layout Component
---------------------------------------- */
export default function RootLayout() {
  return (
    // Force our custom dark theme — never switches to DefaultTheme
    <ThemeProvider value={SET_THEME}>
      <AuthProvider>
        <PlayerProvider>

          <Stack
            initialRouteName="(tabs)"
            screenOptions={{
              // ── Day 57 fixes ──
              headerShown:        false,         // hide all headers globally; screens control their own
              contentStyle:       { backgroundColor: '#120828' }, // force bg on every screen
              animation:          'fade',        // smoother than default slide on dark bg
              animationDuration:  180,           // snappier transitions
            }}
          >

            {/* Main tabs */}
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />

            {/* Auth screens */}
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="register"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />

            {/* Player screen — slides up like a modal */}
            <Stack.Screen
              name="test"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />

            {/* Categories */}
            <Stack.Screen
              name="categories"
              options={{ headerShown: false }}
            />

            {/* Paywall */}
            <Stack.Screen
              name="paywall"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />

          </Stack>

        </PlayerProvider>
      </AuthProvider>

      {/* light — white icons on our dark bg */}
      <StatusBar style="light" />
    </ThemeProvider>
  );
}