import { Spinner } from '@/components/ui/spinner';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center m-auto">
      <Spinner className="size-8" />
    </div>
  );
};
