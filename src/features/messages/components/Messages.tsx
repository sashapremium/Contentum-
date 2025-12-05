import { Skeleton } from '@/components/ui/skeleton';
import { useMessagesQuery } from '../queries/useMessagesQuery';
import type { ChatProps } from '@/features/chat/types/chat.types';
import { Loading } from '@/components/shared/Loading';

export const Messages = ({ chat }: ChatProps) => {
  const { data, isLoading } = useMessagesQuery(chat.id);

  if (isLoading) {
    return <Loading />;
  }

  console.log('data', { data });
  return (
    <div className="space-y-3 pb-32">
      {Array.from({ length: 50 }).map((_, i) => (
        <Skeleton className="h-6 w-[100%]" data-index={i} />
      ))}
    </div>
  );
};
