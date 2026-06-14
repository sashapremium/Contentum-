// Mutation для обновления access токена через refresh. При ошибке вызывает logout.
import { useMutation } from '@tanstack/react-query';
import { refreshRequest } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useRefreshMutation = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: refreshRequest,
    onSuccess: (data) => {
      setTokens({
        access: data.access,
        refresh: data.refresh,
      });
    },
    onError: () => {
      logout();
    },
  });
};
