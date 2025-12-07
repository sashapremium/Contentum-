import type { Message as MessageType } from '../types/messages.types';
import { cx } from 'class-variance-authority';

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.messageType === 'USER';

  const renderTextMessage = () => {
    return message.content.info as string;
  };

  const renderImageMessage = () => {
    return null;
  };

  const renderMessageContent = () => {
    switch (message.content.type) {
      case 'text':
        return renderTextMessage();
      case 'image':
        return renderImageMessage();
      default:
        renderTextMessage();
    }
  };

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
        {renderMessageContent()}
      </div>
    </div>
  );
};
