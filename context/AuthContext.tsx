// =======================================
// AuthContext.tsx
// Handles guest vs authenticated user state
// =======================================

import React, { createContext, useContext, useMemo, useState } from 'react';

// ---------------------------------------
// SECTION 1 — Types
// Define what this context exposes
// ---------------------------------------
type AuthContextType = {
  isGuest: boolean;

  continueAsGuest: () => void;

  // future: login/logout stubs
  login?: () => void;
  logout?: () => void;
};

// ---------------------------------------
// SECTION 2 — Context creation
// ---------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------
// SECTION 3 — Provider component
// Wraps the app and holds auth state
// ---------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {

  // -------------------------------------
  // SECTION 3A — State
  // -------------------------------------
  const [isGuest, setIsGuest] = useState(true);

  // -------------------------------------
  // SECTION 4 — Actions
  // Functions that modify auth state
  // -------------------------------------
  const continueAsGuest = () => setIsGuest(true);
  const login = () => setIsGuest(false);
  const logout = () => setIsGuest(true);

  // -------------------------------------
  // SECTION 5 — Memoized context value
  // What gets exposed to the app
  // -------------------------------------
  const value = useMemo(
    () => ({
      isGuest,
      continueAsGuest,
      login,
      logout,
    }),
    [isGuest]
  );

  // -------------------------------------
  // SECTION 6 — Provider return
  // -------------------------------------
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------
// SECTION 7 — Hook
// Used by screens/components
// ---------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}