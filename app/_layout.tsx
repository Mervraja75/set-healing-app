import { PlayerProvider } from '@/context/PlayerContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PlayerProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>

          {/* Auth Screens (NO TABS) */}
          <Stack.Screen
            name="login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="register"
            options={{ headerShown: false }}
          />

          {/* Main App (WITH TABS) */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          {/* Extra Screens */}
          <Stack.Screen
            name="categories"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="test"
            options={{ headerShown: false }}
          />

          {/* Modal */}
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />

        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </PlayerProvider>
  );
}
