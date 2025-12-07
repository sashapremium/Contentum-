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
        <MessageInput chatId={chat.id} mutation={mutation} />
      </PageWrapper>
    </div>
  );
}

// Right now sending and receiving messages works completely fine. The general flow of how generation works on backend is this - it sends me 9 fixed messages. Each message is a question. There is a total of 9 system messages. After sending an answer to a the final message, backend will start generating an image. Right now this happens right after i call useSendMessageMutation. After it successfully completes, response contains information about image generation - it's file id on backend and other stuff. I can fetch the list of images related to chat
