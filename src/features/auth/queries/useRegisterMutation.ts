import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '../api/register.api';

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerRequest,
  });
};
