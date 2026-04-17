import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  displayName: string | null;
  signIn: (payload?: { displayName?: string | null }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      isAuthenticated,
      displayName,
      signIn: (payload?: { displayName?: string | null }) => {
        setDisplayName(payload?.displayName?.trim() || null);
        setIsAuthenticated(true);
      },
      signOut: () => {
        setDisplayName(null);
        setIsAuthenticated(false);
      },
    }),
    [displayName, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
