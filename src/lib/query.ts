// Глобальный QueryClient retry не повторяет на 401, ошибки показываются через sonner toast,
// refetchOnWindowFocus отключён.

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mapApiError } from './apiErrorMapper';

function handleGlobalError(error: string) {
  toast.error(error, {
    position: 'top-center',
    style: { backgroundColor: 'var(--color-error)' },
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 401) return false;
        return failureCount < 1;
      },
      throwOnError(error) {
        handleGlobalError(mapApiError(error));
        return false;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      throwOnError(error) {
        handleGlobalError(mapApiError(error));
        return false;
      },
    },
  },
});
