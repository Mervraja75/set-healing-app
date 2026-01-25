import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <PlayerProvider>
          <Stack
            initialRouteName="(tabs)"
            screenOptions={{ headerBackTitle: 'Back' }}
          >
            {/* Main app with bottom tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* These are optional screens you can still navigate to from Profile tab */}
            <Stack.Screen name="login" options={{ title: 'Login' }} />
            <Stack.Screen name="register" options={{ title: 'Register' }} />

            {/* Other screens that can be opened from Home/Healing */}
            <Stack.Screen name="categories" options={{ title: 'Categories' }} />
            <Stack.Screen name="test" options={{ title: 'Player' }} />
          </Stack>
        </PlayerProvider>
      </AuthProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}