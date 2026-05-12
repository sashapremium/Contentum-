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
      // Never retry 401s — the axios interceptor already retries after token
      // refresh. A React Query retry on top just produces duplicate toasts and
      // fires the interceptor a second time while tokens are gone.
      retry: (failureCount, error) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
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
