import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginRequest } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useLoginMutation = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setTokens({
        access: data.accessToken,
        refresh: data.refreshToken,
      });
      qc.clear();
    },
  });
};
