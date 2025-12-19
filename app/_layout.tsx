import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>

        {/* Login Screen */}
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />

        {/* Home Screen */}
        <Stack.Screen
          name="index"
          options={{ title: 'Home' }}
        />

        {/* Test Screen */}
        <Stack.Screen
          name="test"
          options={{ title: 'Test' }}
        />

        {/* Tabs (kept for future use) */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Modal (unchanged) */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />

      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
