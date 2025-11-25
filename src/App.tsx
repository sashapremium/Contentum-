import { Button } from '@/components/ui/button';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </QueryClientProvider>
  );
}

export default App;
