// =======================================
// AuthContext.tsx
// Handles guest vs authenticated user state
// Day 99.1 — Role-based access control
// =======================================

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getUserRole } from '@/services/UserService';
import { registerForPushNotifications } from '@/services/NotificationService';

const auth = getAuth(app);

/* ---------------------------------------
   SECTION 1 — Types
---------------------------------------- */

// SECTION 1A — Role type
export type UserRole = 'guest' | 'customer' | 'admin';

// SECTION 1B — User model
export type AuthUser = {
  uid: string;
  name: string;
  email: string;
};

// SECTION 1C — Context API
type AuthContextType = {
  // SECTION 1C1 — Session flags
  isGuest: boolean;
  user: AuthUser | null;

  // SECTION 1C2 — Role
  userRole: UserRole;

  // SECTION 1C3 — Guest flow
  continueAsGuest: () => void;

  // SECTION 1C4 — Auth flows
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;

  // SECTION 1C5 — Premium flags
  isPro: boolean;
  upgradeToPro: () => void;
};

/* ---------------------------------------
   SECTION 2 — Context creation
---------------------------------------- */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------------------------------
   SECTION 3 — Provider
---------------------------------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {

  /* -------------------------------------
     SECTION 3A — State
  -------------------------------------- */
  const [user,     setUser]     = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isPro,    setIsPro]    = useState(false);

  const isGuest = !user;

  /* -------------------------------------
     SECTION 3B — Firebase Auth listener
     Handles Apple / Google sign-ins and
     restores persisted sessions on launch.
     Role is fetched from Firestore after
     the Firebase user is confirmed.
  -------------------------------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] onAuthStateChanged fired — firebaseUser:', firebaseUser ? 'signed in' : 'null');

      if (!firebaseUser) {
        console.log('[AuthContext] No Firebase user — staying as guest');
        return;
      }

      console.log('[AuthContext] Firebase uid:', firebaseUser.uid);
      console.log('[AuthContext] Firebase email:', firebaseUser.email);

      setUser({
        uid:   firebaseUser.uid,
        name:  firebaseUser.displayName ?? 'Member',
        email: firebaseUser.email ?? '',
      });

      const role = await getUserRole(firebaseUser.uid);
      console.log('[AuthContext] Role returned from getUserRole:', role);
      setUserRole(role);

      try {
        registerForPushNotifications();
      } catch (e) {
        console.log('[AuthContext] registerForPushNotifications failed:', e);
      }
    });
    return unsubscribe;
  }, []);

  /* -------------------------------------
     SECTION 4 — Actions
  -------------------------------------- */

  // SECTION 4A — Guest mode
  const continueAsGuest = () => {
    setUser(null);
    setUserRole('guest');
    setIsPro(false);
  };

  // SECTION 4B — UI-only email login
  // Role defaults to 'customer'; Firebase Auth listener may
  // override with 'admin' if the user also has a live session.
  const login = (email: string) => {
    setUser({ uid: auth.currentUser?.uid ?? '', name: 'Member', email });
    setUserRole('customer');
  };

  // SECTION 4C — Register (UI-only)
  const register = (name: string, email: string) => {
    setUser({ uid: auth.currentUser?.uid ?? '', name, email });
    setUserRole('customer');
  };

  // SECTION 4D — Logout
  // Signs out from Firebase Auth so Apple/Google sessions are
  // cleared, then resets all local state.
  const logout = () => {
    setUser(null);
    setUserRole('guest');
    setIsPro(false);
    firebaseSignOut(auth).catch(() => {});
  };

  // SECTION 4E — Upgrade to Pro
  const upgradeToPro = () => setIsPro(true);

  /* -------------------------------------
     SECTION 5 — Memoized context value
  -------------------------------------- */
  const value = useMemo(
    () => ({
      isGuest,
      user,
      userRole,
      continueAsGuest,
      login,
      register,
      logout,
      isPro,
      upgradeToPro,
    }),
    [isGuest, user, userRole, isPro]
  );

  /* -------------------------------------
     SECTION 6 — Provider return
  -------------------------------------- */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------------------------------------
   SECTION 7 — Hook
---------------------------------------- */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
