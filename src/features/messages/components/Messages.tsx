import { Skeleton } from '@/components/ui/skeleton';

export const Messages = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 50 }).map((_, i) => (
        <Skeleton className="h-6 w-[100%]" data-index={i} />
      ))}
    </div>
  );
};
