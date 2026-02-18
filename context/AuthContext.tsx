// =======================================
// AuthContext.tsx
// Handles guest vs authenticated user state (UI-only for now)
// =======================================

import React, { createContext, useContext, useMemo, useState } from 'react';

/* ---------------------------------------
   SECTION 1 — Types
   Define what this context exposes
---------------------------------------- */

// SECTION 1A — User model (UI-only)
// ✅ Later: this can mirror your Firebase user/doc shape
export type AuthUser = {
  name: string;
  email: string;
};

// SECTION 1B — Context API (what screens can call)
type AuthContextType = {
  // SECTION 1B1 — Session flags
  isGuest: boolean;
  user: AuthUser | null;

  // SECTION 1B2 — Guest flow
  continueAsGuest: () => void;

  // SECTION 1B3 — Auth flows (UI-only now, real backend later)
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;

  // SECTION 1B4 — Premium flags (UI-only now)
  isPro: boolean;
  upgradeToPro: () => void;
};

/* ---------------------------------------
   SECTION 2 — Context creation
---------------------------------------- */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------------------------------
   SECTION 3 — Provider component
   Wraps the app and holds auth state
---------------------------------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /* -------------------------------------
     SECTION 3A — State
     ✅ This is the “single source of truth”
  -------------------------------------- */

  // SECTION 3A1 — Who is the user?
  const [user, setUser] = useState<AuthUser | null>(null);

  // SECTION 3A2 — Guest flag (derived from user)
  // ✅ Keep explicit flag to make UI logic super obvious
  const isGuest = !user;

  // SECTION 3A3 — Premium flag (UI-only)
  const [isPro, setIsPro] = useState(false);

  /* -------------------------------------
     SECTION 4 — Actions
     Functions that modify auth state
  -------------------------------------- */

  // SECTION 4A — Guest mode
  const continueAsGuest = () => {
    setUser(null);
    setIsPro(false); // optional: reset premium when switching to guest
  };

  // SECTION 4B — Login (UI-only)
  // ✅ Later: replace internals with Firebase Auth signInWithEmailAndPassword
  const login = (email: string) => {
    // UI-only placeholder user
    setUser({
      name: 'Member',
      email,
    });
  };

  // SECTION 4C — Register (UI-only)
  // ✅ Later: replace internals with Firebase Auth createUserWithEmailAndPassword + Firestore user doc
  const register = (name: string, email: string) => {
    setUser({
      name,
      email,
    });
  };

  // SECTION 4D — Logout
  const logout = () => {
    setUser(null);
    setIsPro(false);
  };

  // SECTION 4E — Upgrade to Pro (UI-only)
  const upgradeToPro = () => {
    setIsPro(true);
  };

  /* -------------------------------------
     SECTION 5 — Memoized context value
     What gets exposed to the app
  -------------------------------------- */
  const value = useMemo(
    () => ({
      isGuest,
      user,
      continueAsGuest,
      login,
      register,
      logout,
      isPro,
      upgradeToPro,
    }),
    [isGuest, user, isPro]
  );

  /* -------------------------------------
     SECTION 6 — Provider return
  -------------------------------------- */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------------------------------------
   SECTION 7 — Hook
   Used by screens/components
---------------------------------------- */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}