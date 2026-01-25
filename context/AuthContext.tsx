import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthContextType = {
  isGuest: boolean;
  continueAsGuest: () => void;
  // future: login/logout stubs
  login?: () => void;
  logout?: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(true);

  const continueAsGuest = () => setIsGuest(true);
  const login = () => setIsGuest(false);
  const logout = () => setIsGuest(true);

  const value = useMemo(
    () => ({ isGuest, continueAsGuest, login, logout }),
    [isGuest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}