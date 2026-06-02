// =======================================
// ROOT LAYOUT (app/_layout.tsx)
// Day 57 — Performance + dark theme fixes
// Day 97 — Splash screen held until fonts/resources ready
// =======================================

/* ---------------------------------------
   SECTION A — Imports
---------------------------------------- */
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';

/* ---------------------------------------
   Keep the splash screen visible until
   fonts and resources are fully loaded.
   Must be called before any component renders.
---------------------------------------- */
SplashScreen.preventAutoHideAsync();

/* ---------------------------------------
   SECTION B — Custom dark theme
   Overrides React Navigation defaults so
   our deep purple bg is never overwritten
---------------------------------------- */
const SET_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background:   '#0A0616',   // matches C.bg across all screens
    card:         '#1A0A2E',   // tab bar + header bg
    text:         '#FFFFFF',
    border:       'rgba(201, 168, 76, 0.15)',
    notification: '#C9A84C',
    primary:      '#C9A84C',
  },
};

/* ---------------------------------------
   SECTION C — Root Layout Component
---------------------------------------- */
export default function RootLayout() {
  // useFonts returns true immediately when the map is empty,
  // and will block here when custom fonts are added in future.
  const [fontsLoaded] = useFonts({
    // Custom fonts go here, e.g.:
    // 'Cormorant-Light': require('../assets/fonts/Cormorant-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen only after fonts (and any other
      // async resources) are confirmed ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Hold — splash screen is still covering the screen at this point.
  if (!fontsLoaded) {
    return null;
  }

  return (
    // Force our custom dark theme — never switches to DefaultTheme
    <ThemeProvider value={SET_THEME}>
      <AuthProvider>
        <PlayerProvider>

          <Stack
            initialRouteName="(tabs)"
            screenOptions={{
              headerShown:        false,         // screens control their own headers
              contentStyle:       { backgroundColor: '#0A0616' },
              animation:          'fade',
              animationDuration:  180,
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

            {/* Legal screens */}
            <Stack.Screen
              name="privacy"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="terms"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />

          </Stack>

        </PlayerProvider>
      </AuthProvider>

      {/* Light icons on dark bg. backgroundColor targets Android status bar. */}
      <StatusBar style="light" backgroundColor="#0A0616" />
    </ThemeProvider>
  );
}
