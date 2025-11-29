import { Spinner } from '@/components/ui/spinner';

export const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <Spinner className="size-8" />
    </div>
  );
};
