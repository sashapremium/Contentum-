import type { RegenerationRequestMessage } from '@/features/chat/types/chat.types';

interface MessageRegenProps {
  message: RegenerationRequestMessage;
}

export const MessageRegen = ({ message }: MessageRegenProps) => {
  return <>{message.payload.comment}</>;
};
