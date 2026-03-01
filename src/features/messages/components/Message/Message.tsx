import { cx } from 'class-variance-authority';
import type { ChatMessage } from '@/features/chat/types/chat.types';
import { MessageRegen } from '../MessageRegen/MessageRegen';
import { MessageGenerated } from '../MessageGenerated/MessageGenerated';
import { MessageForm } from '../MessageForm/MessageForm';

interface MessageProps {
  message: ChatMessage;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.type === 'regeneration_request';

  const renderMessageContent = () => {
    switch (message.type) {
      case 'regeneration_request':
        return <MessageRegen message={message} />;
      case 'generated_text':
        return <MessageGenerated message={message} />;
      case 'form':
        return <MessageForm message={message} />;
      default:
        return (
          <>
            <span>Unknown message type: </span>
            {JSON.stringify(message)}
          </>
        );
    }
  };

  return (
    <div
      className={cx(
        'group',
        'flex flex-col',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={cx(
          'max-w-[75%] px-4 py-2 text-sm shadow-sm rounded-xl',

          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',

          isUser ? 'rounded-br-none' : 'rounded-bl-none',
        )}
      >
        {renderMessageContent()}
      </div>
      {/* <MessageActions message={message} /> */}
    </div>
  );
};
