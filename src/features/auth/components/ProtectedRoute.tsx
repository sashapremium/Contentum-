import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import type { ReactNode } from 'react';
import { LoadingPage } from '@/app/pages/LoadingPage';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuthStore();

  if (!isReady) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
