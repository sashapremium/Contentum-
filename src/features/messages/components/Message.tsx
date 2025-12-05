import type { Message as MessageType } from '../types/messages.types';
import { cx } from 'class-variance-authority';

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.messageType === 'USER';

  return (
    <div
      className={cx('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cx(
          'max-w-[75%] px-4 py-2 text-sm shadow-sm rounded-xl',

          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',

          isUser ? 'rounded-br-none' : 'rounded-bl-none'
        )}
      >
        {message.content}
      </div>
    </div>
  );
};
