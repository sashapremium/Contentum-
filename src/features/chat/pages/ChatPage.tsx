import { useParams } from 'react-router-dom';
import { useChatQuery } from '../queries/useChatQuery';
import { Error } from '@/components/shared/Error';
import { mapApiError } from '@/lib/apiErrorMapper';
import { ChatPageHeader } from '../components/ChatPageHeader';
import { MessageInput } from '@/features/messages/components/MessageInput';
import { Messages } from '@/features/messages/components/Messages';

export default function ChatPage() {
  const { chatId } = useParams();
  const { data, isLoading, isError, error } = useChatQuery(chatId);

  if (!chatId) {
    return (
      <div className="m-auto">
        <Error description="Чат с данным id не найден" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-auto">
        <Error description={mapApiError(error)} />
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <ChatPageHeader chat={data} />

      <div className="sm:px-6 md:px-16 lg:px-32 xl:px-64">
        <Messages />
      </div>

      <div className="z-20 bg-background sticky bottom-0 px-4 sm:px-6 md:px-16 lg:px-32 xl:px-64">
        <MessageInput />
      </div>
    </div>
  );
}
