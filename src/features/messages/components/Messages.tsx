import { useMessagesQuery } from '../queries/useMessagesQuery';
import { Loading } from '@/components/shared/Loading';
import { mapApiError } from '@/lib/apiErrorMapper';
import { Error } from '@/components/shared/Error';
import { Message } from './Message';

interface MessagesProps {
  chatId?: string;
}

export const Messages = ({ chatId }: MessagesProps) => {
  const {
    data: messages,
    isLoading,
    isError,
    error,
  } = useMessagesQuery(chatId);

  console.log('Messages', { chatId, messages, isLoading, isError, error });

  if (isLoading) {
    return <Loading />;
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
    </div>
  );
};
