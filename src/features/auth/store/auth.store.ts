// Zustand store для состояния аутентификации.
// isReady: false пока AuthProvider не завершил инициализацию из localStorage.
import { create } from 'zustand';
import { tokenStorage } from '../utils/tokenStorage';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthState {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isReady: boolean;
  setTokens(tokens: AuthTokens): void;
  logout(): void;
  setReady(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
  tokens: null,
  isAuthenticated: false,
  isReady: false,

  setTokens(tokens) {
    tokenStorage.save(tokens);
    set({ tokens, isAuthenticated: true });
  },

  logout() {
    tokenStorage.clear();
    set({ tokens: null, isAuthenticated: false });
  },

  setReady() {
    set({ isReady: true });
  },
}));
