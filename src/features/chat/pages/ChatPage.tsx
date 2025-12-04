import { useParams } from 'react-router-dom';
import { useChatQuery } from '../queries/useChatQuery';
import { Error } from '@/components/shared/Error';
import { mapApiError } from '@/lib/apiErrorMapper';
import { ChatPageHeader } from '../components/ChatPageHeader';

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
    <>
      <ChatPageHeader chat={data} />
    </>
  );
}
