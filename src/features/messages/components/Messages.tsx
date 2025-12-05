import { Skeleton } from '@/components/ui/skeleton';
import { useMessagesQuery } from '../queries/useMessagesQuery';
import type { ChatProps } from '@/features/chat/types/chat.types';
import { Loading } from '@/components/shared/Loading';
import { mapApiError } from '@/lib/apiErrorMapper';
import { Error } from '@/components/shared/Error';

export const Messages = ({ chat }: ChatProps) => {
  const {
    data: messages,
    isLoading,
    isError,
    error,
  } = useMessagesQuery(chat?.id);

  console.log('Messages', { chat, messages, isLoading, isError, error });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="m-auto">
        <Error description={mapApiError(error)} />
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-32">
      {Array.from({ length: 50 }).map((_, i) => (
        <Skeleton className="h-6 w-[100%]" data-index={i} />
      ))}
    </div>
  );
};
