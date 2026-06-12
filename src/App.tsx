import { QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from '@/app/router';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/ui/theme-provider';
import { queryClient } from './lib/query';

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster />
          <AppRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
