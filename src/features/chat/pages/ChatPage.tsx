import { useParams } from 'react-router-dom';
import { useChatQuery } from '../queries/useChatQuery';
import { Error } from '@/components/shared/Error';
import { mapApiError } from '@/lib/apiErrorMapper';

export default function ChatPage() {
  const { chatId } = useParams();
  const { data, isLoading, isError, error } = useChatQuery(chatId);

  if (!chatId) {
    return <Error description="Чат с данным id не найден" />;
  }

  if (isError) {
    return <Error description={mapApiError(error)} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl">{data?.title}</h1>

      <div className="mt-4">Здесь будут сообщения…</div>
    </div>
  );
}
