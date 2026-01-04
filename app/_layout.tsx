import { PlayerProvider } from '@/context/PlayerContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PlayerProvider>
        <Stack
          screenOptions={{
            headerBackTitle: 'Back', // ✅ works
          }}
        >
          {/* Tabs */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          {/* Auth Screens */}
          <Stack.Screen
            name="login"
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="register"
            options={{ title: 'Register' }}
          />

          {/* Inner Screens */}
          <Stack.Screen
            name="categories"
            options={{ title: 'Categories' }}
          />
          <Stack.Screen
            name="test"
            options={{ title: 'Player' }}
          />
        </Stack>
      </PlayerProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
