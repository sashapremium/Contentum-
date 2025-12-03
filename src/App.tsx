import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppRouter } from '@/app/router';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/ui/theme-provider';
import { toast } from 'sonner';
import { mapApiError } from './lib/apiErrorMapper';

function handleGlobalError(error: string) {
  toast.error(error, {
    position: 'top-center',
    style: { backgroundColor: 'var(--color-error)' },
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      throwOnError(error) {
        handleGlobalError(mapApiError(error));
        return false;
      },
    },
    mutations: {
      throwOnError(error) {
        handleGlobalError(mapApiError(error));
        return false;
      },
    },
  },
});

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
          <AppRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
