import { useMessagesQuery } from '../queries/useMessagesQuery';
import { Loading } from '@/components/shared/Loading';
import { mapApiError } from '@/lib/apiErrorMapper';
import { Error } from '@/components/shared/Error';
import { Message } from './Message';
import { useEffect, useRef } from 'react';

interface MessagesProps {
  chatId: string;
  sendLoading: boolean;
}

export const Messages = ({ chatId, sendLoading }: MessagesProps) => {
  const {
    data: messages,
    isLoading,
    isFetching,
    isError,
    error,
  } = useMessagesQuery(chatId);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messages) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages?.length]);

  if (isLoading) {
    return <Loading className="pb-6" />;
  }

  if (isError || !messages) {
    return (
      <div className="m-auto">
        <Error description={mapApiError(error)} />
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-32">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}

      {(sendLoading || isFetching) && <Loading className="inline-flex p-2" />}

      <div ref={bottomRef} />
    </div>
  );
};
