import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token: string, user: User) => {
        localStorage.setItem('access_token', token);
        // Also set in cookie for middleware access
        document.cookie = `access_token=${token}; path=/; max-age=86400; samesite=strict`;
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        // Remove cookie
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);