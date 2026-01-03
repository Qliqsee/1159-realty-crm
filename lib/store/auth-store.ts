import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { clientCookie } from "@/lib/cookies";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true to prevent flash

      login: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false });
        // Also set client-side cookie
        clientCookie.setUser(user);
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
        // Also remove client-side cookie
        clientCookie.removeUser();
      },

      updateUser: (updatedFields: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      onRehydrateStorage: () => (state) => {
        // After rehydration, check if user exists and set isAuthenticated accordingly
        if (state) {
          state.isAuthenticated = !!state.user;
          state.isLoading = false;
        }
      },
    }
  )
);
