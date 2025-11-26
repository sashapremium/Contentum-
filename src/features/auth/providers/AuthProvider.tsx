import type { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  // You may add token-based hydration later here
  // e.g. check localStorage, fetch user, validate token, etc.

  return <>{children}</>;
}
