// =======================================
// services/AuthService.ts
// Social authentication — Apple & Google
// =======================================
//
// Apple Sign In: works in Expo Go on a physical iOS device.
//   Requires "Sign In with Apple" capability enabled in Xcode / app.json.
//
// Google Sign In: requires a native EAS build (Week 2).
//   signInWithGoogle() shows an informational alert in the meantime.

import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  OAuthProvider,
  getAuth,
  signInWithCredential,
} from 'firebase/auth';

import { app } from '@/lib/firebase';

const auth = getAuth(app);

/* ──────────────────────────────────────
   Apple Sign In
   iOS only — throws ERR_REQUEST_CANCELED
   if the user dismisses the sheet
────────────────────────────────────────*/
export async function signInWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const { identityToken } = credential;
  if (!identityToken) throw new Error('Apple Sign In: no identity token returned.');

  const provider = new OAuthProvider('apple.com');
  const firebaseCredential = provider.credential({ idToken: identityToken });

  return signInWithCredential(auth, firebaseCredential);
}

/* ──────────────────────────────────────
   Google Sign In — placeholder
   Full implementation requires a native
   EAS build (coming in Week 2).
   Throws so login.tsx error handling is
   not triggered for a deliberate dismiss.
────────────────────────────────────────*/
export async function signInWithGoogle(): Promise<never> {
  await new Promise<void>((resolve) => {
    Alert.alert(
      'Coming Soon',
      'Google Sign In will be available in the full build. Use email or Apple Sign In for now.',
      [{ text: 'OK', onPress: () => resolve() }]
    );
  });
  // Throw with the "cancelled" code so login.tsx suppresses the error banner
  const err: any = new Error('Google Sign In not yet available in Expo Go.');
  err.code = 'SIGN_IN_CANCELLED';
  throw err;
}
