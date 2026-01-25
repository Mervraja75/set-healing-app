import { Redirect } from 'expo-router';

export default function Index() {
  // App entry point → redirect to Login
  return <Redirect href="/(tabs)" />;
}
