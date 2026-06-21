// При монтировании читает токены из localStorage и записывает в auth store
import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';
import { tokenStorage } from '../utils/tokenStorage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setReady = useAuthStore((s) => s.setReady);

  useEffect(() => {
    const saved = tokenStorage.load();

    if (saved) {
      setTokens(saved);
    }

    setReady();
  }, [setTokens, setReady]);

  return <>{children}</>;
}
