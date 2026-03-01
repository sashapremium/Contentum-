import type { FormMessage } from '@/features/chat/types/chat.types';
import { FormContainer } from '@/features/forms/components/FormContainer';
import type { FormSubmit } from '@/features/forms/types/formField.types';

interface MessageFormProps {
  message: FormMessage;
}

export const MessageForm = ({ message }: MessageFormProps) => {
  const form = message.payload;

  const handleSubmit = (data: FormSubmit) => {
    console.log('Submitted values', data);
  };

  return <FormContainer formStep={form} onSubmit={handleSubmit} />;
};
