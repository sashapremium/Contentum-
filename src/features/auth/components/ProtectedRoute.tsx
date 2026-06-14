// Защищеннй роут: пока store не готов, показывает спиннер.
// Если не аутентифицирован, перенаправляет на /login.
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import type { ReactNode } from 'react';
import { Loading } from '@/components/shared/Loading';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuthStore();

  if (!isReady) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
