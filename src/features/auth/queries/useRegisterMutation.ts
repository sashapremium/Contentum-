import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '../api/auth.api';

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerRequest,
  });
};
