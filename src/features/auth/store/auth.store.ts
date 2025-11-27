import { create } from 'zustand';
import { tokenStorage } from '../utils/tokenStorage';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthState {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setTokens(tokens: AuthTokens): void;
  logout(): void;
  restoreFromStorage(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
  tokens: null,
  isAuthenticated: false,

  setTokens(tokens) {
    tokenStorage.save(tokens);
    set({ tokens, isAuthenticated: true });
  },

  logout() {
    tokenStorage.clear();
    set({ tokens: null, isAuthenticated: false });
  },

  restoreFromStorage() {
    const saved = tokenStorage.load();
    if (!saved) return;
    set({ tokens: saved, isAuthenticated: true });
  },
}));
