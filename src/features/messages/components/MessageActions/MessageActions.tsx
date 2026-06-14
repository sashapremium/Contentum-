// Действия над сообщением. Для generatedText показывает кнопку перегенерации.
// Для form и regenerationRequest не рендерит ничего.

import type { ChatId, ChatMessage } from '@/features/chat/types/chat.types';
import { RegenAction } from './RegenAction';
import { useRegenerateMutation } from '@/features/briefs/queries/regenerateMutation';

export interface MessageActionsProps {
  message: ChatMessage;
  chatId: ChatId;
}

export const MessageActions = ({ message, chatId }: MessageActionsProps) => {
  const regenerate = useRegenerateMutation();

  const handleRegen = () => {
    regenerate.mutate({
      id: chatId,
      data: {
        status: 'regeneration',
      },
    });
  };

  switch (message.type) {
    case 'regenerationRequest':
    case 'form':
      return null;

    case 'generatedText':
      return (
        <div className="flex gap-2 mt-1 px-1 md:opacity-0 transition group-hover:opacity-100">
          <RegenAction handleRegen={handleRegen} />
        </div>
      );

    default:
      return null;
  }
};
