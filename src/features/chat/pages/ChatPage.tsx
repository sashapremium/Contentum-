import { useParams } from 'react-router-dom';
import { useChatQuery } from '../queries/useChatQuery';
import { Error } from '@/components/shared/Error';
import { mapApiError } from '@/lib/apiErrorMapper';
import { ChatPageHeader } from '../components/ChatPageHeader';
import { Messages } from '@/features/messages/components/Messages';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { useSendMessageMutation } from '@/features/messages/queries/useSendMessageMutation';

export default function ChatPage() {
  const { chatId } = useParams();
  const { data: chat, isLoading, isError, error } = useChatQuery(chatId);
  const mutation = useSendMessageMutation(chat?.id || '');

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
    <div className="flex flex-col gap-4">
      <ChatPageHeader chat={chat} />
      <PageWrapper>
        <Messages chatId={chat.id} sendLoading={mutation.isPending} />
      </PageWrapper>
    </div>
  );
}
