// Форма шага бриефа внутри сообщения

import { useUpdateChatMutation } from '@/features/chat/queries/useUpdateChatMutation';
import type { ChatId, FormMessage } from '@/features/chat/types/chat.types';
import { FormContainer } from '@/features/forms/components/FormContainer';
import type { FormSubmit } from '@/features/forms/types/formField.types';

interface MessageFormProps {
  message: FormMessage;
  chatId: ChatId;
}

export const MessageForm = ({ message, chatId }: MessageFormProps) => {
  const nextStepMutation = useUpdateChatMutation();

  const form = message.payload;

  const handleSubmit = (data: FormSubmit) => {
    console.log('Submitted values', data);

    nextStepMutation.mutate({
      id: chatId,
      data: {
        step: data.step,
        mode: data.mode,
        fields: data.fields,
      },
    });
  };

  return <FormContainer formStep={form} onSubmit={handleSubmit} />;
};
