import React, { createContext, useContext, useMemo } from 'react';

import { useAuthStore } from '@/stores/use-auth-store';
import { useProfileStore } from '@/stores/use-profile-store';

type AuthContextValue = {
  isAuthenticated: boolean;
  displayName: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (full_name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const displayName = useProfileStore((state) => state.displayName);
  const setDisplayName = useProfileStore((state) => state.setDisplayName);

  const resolvedDisplayName = user?.full_name?.trim() || displayName;

  const value = useMemo(
    () => ({
      isAuthenticated: isLoggedIn,
      displayName: resolvedDisplayName,
      loading,
      error,
      login,
      register,
      signOut: () => {
        logout();
        setDisplayName('Kullanici');
      },
    }),
    [displayName, error, isLoggedIn, loading, login, logout, register, resolvedDisplayName, setDisplayName],
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
