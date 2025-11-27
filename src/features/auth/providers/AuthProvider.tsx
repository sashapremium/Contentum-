import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const restoreFromStorage = useAuthStore((state) => state.restoreFromStorage);

  useEffect(() => {
    restoreFromStorage();
  }, [restoreFromStorage]);

  return <>{children}</>;
}
