import { useParams } from 'react-router-dom';
import { useChatQuery } from '../queries/useChatQuery';
import { Error } from '@/components/shared/Error';
import { mapApiError } from '@/lib/apiErrorMapper';
import { ChatPageHeader } from '../components/ChatPageHeader';
import { MessageInput } from '@/features/messages/components/MessageInput';
import { Messages } from '@/features/messages/components/Messages';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { useSendMessageMutation } from '@/features/messages/queries/useSendMessageMutation';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

export default function ChatPage() {
  const { chatId } = useParams();
  const { data: chat, isLoading, isError, error } = useChatQuery(chatId);
  const mutation = useSendMessageMutation(chat?.id || '');
  const hideInput = chat?.lastMessage.content.type === 'image';

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
        {hideInput ? (
          <div className="z-2 bg-background sticky bottom-0 pb-6">
            <Card>
              <CardContent>
                <CardTitle>
                  Чат окончен. Чтобы сгенерировать новое изображение, создайте
                  новый чат
                </CardTitle>
              </CardContent>
            </Card>
          </div>
        ) : (
          <MessageInput chatId={chat.id} mutation={mutation} />
        )}
      </PageWrapper>
    </div>
  );
}
