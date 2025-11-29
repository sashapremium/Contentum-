import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useLoginMutation = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setTokens({
        access: data.access,
        refresh: data.refresh,
      });
    },
  });
};
