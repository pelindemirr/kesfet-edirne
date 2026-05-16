import { getCurrentUser as apiGetCurrentUser, login as apiLogin, register as apiRegister } from '@/services/api/endpoints/auth';
import { create } from 'zustand';

type AuthUser = {
  id: string;
  email: string;
  full_name: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  token: string | null;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (full_name: string, email: string, password: string) => Promise<boolean>;
  getCurrentUser: () => Promise<boolean>;
  logout: () => void;
};

function isSuccessfulAuthResponse(response: { status?: number; success?: boolean; bodyStatus?: string; user?: AuthUser | null; token?: string | null }) {
  return (
    response.success === true ||
    response.bodyStatus === 'success' ||
    response.status === 200 ||
    response.status === 201
  );
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  error: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    console.log('[AuthStore] Login attempt for:', email);

    try {
      const response = await apiLogin(email, password);
      console.log('[AuthStore] Login response received:', { status: response.status, bodyStatus: response.bodyStatus, success: response.success });

      if (!isSuccessfulAuthResponse(response) || !response.user || !response.token) {
        const errorMsg = response.error || response.message || 'Giriş başarısız';
        console.log('[AuthStore] Login failed:', errorMsg);
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          error: errorMsg,
        });
        return false;
      }

      console.log('[AuthStore] Login successful! User:', response.user.email);
      set({
        isLoggedIn: true,
        user: response.user,
        token: response.token,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Giriş başarısız!';
      console.error('[AuthStore] Login error:', errorMsg);
      set({
        isLoggedIn: false,
        user: null,
        token: null,
        error: errorMsg,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (full_name, email, password) => {
    set({ loading: true, error: null });
    console.log('[AuthStore] Register attempt for:', email, 'name:', full_name);

    try {
      const response = await apiRegister(full_name, email, password);
      console.log('[AuthStore] Register response received:', { status: response.status, bodyStatus: response.bodyStatus, success: response.success });

      if (!isSuccessfulAuthResponse(response) || !response.user || !response.token) {
        const errorMsg = response.error || response.message || 'Kayıt başarısız';
        console.log('[AuthStore] Register failed:', errorMsg);
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          error: errorMsg,
        });
        return false;
      }

      console.log('[AuthStore] Register successful! User:', response.user.email);
      set({
        isLoggedIn: true,
        user: response.user,
        token: response.token,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Kayıt başarısız!';
      console.error('[AuthStore] Register error:', errorMsg);
      set({
        isLoggedIn: false,
        user: null,
        token: null,
        error: errorMsg,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getCurrentUser: async () => {
    const token = get().token;

    if (!token) {
      console.log('[AuthStore] getCurrentUser failed - no token found');
      set({ isLoggedIn: false, user: null, token: null, error: null });
      return false;
    }

    try {
      set({ loading: true });
      console.log('[AuthStore] Fetching current user...');
      const response = await apiGetCurrentUser(token);

      if (!isSuccessfulAuthResponse(response) || !response.user) {
        console.log('[AuthStore] getCurrentUser failed - no user in response');
        set({ isLoggedIn: false, user: null, token: null, error: null });
        return false;
      }

      console.log('[AuthStore] getCurrentUser successful! User:', response.user.email);
      set({ isLoggedIn: true, user: response.user, token, error: null });
      return true;
    } catch (error) {
      console.error('[AuthStore] getCurrentUser error:', error);
      set({ isLoggedIn: false, user: null, token: null, error: null });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    console.log('[AuthStore] User logged out');
    set({ isLoggedIn: false, user: null, token: null, error: null });
  },
}));
