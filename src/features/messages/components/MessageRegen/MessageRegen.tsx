import type { RegenerationRequestMessage } from '@/features/chat/types/chat.types';
import { cx } from 'class-variance-authority';

interface MessageRegenProps {
  message: RegenerationRequestMessage;
}

export const MessageRegen = ({ message }: MessageRegenProps) => {
  return (
    <div
      className={cx(
        'max-w-[75%] px-4 py-2 text-sm shadow-sm rounded-xl',
        'bg-primary text-primary-foreground',
        'rounded-br-none',
      )}
    >
      {message.payload.comment}
    </div>
  );
};
