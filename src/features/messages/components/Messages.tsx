// Список сообщений чата
// показывает pending bubble с текстом про генерацию или обработку шага
// Автоскролл к последнему сообщению при изменении списка

import { mapApiError } from '@/lib/apiErrorMapper';
import { Error } from '@/components/shared/Error';
import { Message } from './Message/Message';
import { useEffect, useRef } from 'react';
import { useChatQuery } from '@/features/chat/queries/useChatQuery';
import type { ChatId } from '@/features/chat/types/chat.types';
import {
  UPDATE_CHAT_MUTATION_KEY,
  type UpdateChatVariables,
} from '@/features/chat/queries/useUpdateChatMutation';
import { LoaderCircle } from 'lucide-react';
import { cx } from 'class-variance-authority';
import { useMutationState } from '@tanstack/react-query';
import { Loading } from '@/components/shared/Loading';

interface MessagesProps {
  chatId: ChatId;
  sendLoading: boolean;
}

export const Messages = ({ chatId, sendLoading }: MessagesProps) => {
  const {
    data: chat,
    isLoading,
    isFetching,
    isError,
    error,
  } = useChatQuery(chatId);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messages = chat?.messages;
  const pendingUpdates = useMutationState<UpdateChatVariables>({
    filters: {
      mutationKey: UPDATE_CHAT_MUTATION_KEY,
      status: 'pending',
    },
    select: (mutation) => mutation.state.variables,
  });
  const activeUpdate = pendingUpdates.at(-1);

  useEffect(() => {
    if (!messages) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages?.length, activeUpdate]);

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

  const pendingStep = activeUpdate?.data.step;
  const isRegeneration =
    typeof pendingStep === 'string' &&
    pendingStep.toLowerCase().includes('regen');
  const isGeneration = pendingStep === 3 || isRegeneration;
  const showPendingBubble = Boolean(activeUpdate) || sendLoading || isFetching;
  const pendingTitle = isGeneration
    ? isRegeneration
      ? 'Перегенерируем варианты текста'
      : 'Генерируем варианты текста'
    : 'Обрабатываем шаг';
  const pendingDescription = isGeneration
    ? 'Это может занять несколько секунд. Результат появится в чате автоматически.'
    : 'Сохраняем данные и подготавливаем следующий шаг формы.';

  return (
    <div className="space-y-6 pb-12">
      {messages.map((msg, idx) => (
        <Message chatId={chatId} key={msg.id ?? idx} message={msg} />
      ))}

      {showPendingBubble && (
        <div className="flex flex-col items-start">
          <div
            className={cx(
              'w-full rounded-xl rounded-bl-none bg-muted p-4 text-foreground shadow-sm',
              'border border-border/60',
            )}
          >
            <div className="flex items-start gap-3">
              <LoaderCircle className="mt-0.5 size-5 shrink-0 animate-spin text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{pendingTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {pendingDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
