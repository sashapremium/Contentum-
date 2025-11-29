import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppRouter } from '@/app/router';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
        <AppRouter />
      </QueryClientProvider>
    </AuthProvider>
  );
}
