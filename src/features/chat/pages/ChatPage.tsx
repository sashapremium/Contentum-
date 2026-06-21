// Страница чата: загружает чат по id из URL, показывает список сообщений
import { useParams } from 'react-router-dom';
import { useChatQuery } from '../queries/useChatQuery';
import { Error } from '@/components/shared/Error';
import { mapApiError } from '@/lib/apiErrorMapper';
import { Messages } from '@/features/messages/components/Messages';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeading } from '@/components/shared/PageHeading';

export default function ChatPage() {
  const { chatId } = useParams();
  const {
    data: chat,
    isLoading,
    isPending,
    isError,
    error,
  } = useChatQuery(chatId);

  console.log('ChatPage', { chatId, chat });
  if (!chatId) {
    return (
      <div className="m-auto">
        <Error description="Чат с данным id не найден" />
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !chat) {
    return (
      <div className="m-auto">
        <Error description={mapApiError(error)} />
      </div>
    );
  }

  return (
    <PageWrapper size="medium" header={<PageHeading>{chat.title}</PageHeading>}>
      <Messages chatId={chat.id} sendLoading={isPending} />
    </PageWrapper>
  );
}
