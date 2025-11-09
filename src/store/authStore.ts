import { create } from 'zustand';
import { User } from '../types';
import { AuthService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  initAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await AuthService.getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });

      // Listen to auth changes
      AuthService.onAuthStateChange((user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await AuthService.signOut();
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
