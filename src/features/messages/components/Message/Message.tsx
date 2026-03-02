import { cx } from 'class-variance-authority';
import type { ChatId, ChatMessage } from '@/features/chat/types/chat.types';
import { MessageRegen } from '../MessageRegen/MessageRegen';
import { MessageGenerated } from '../MessageGenerated/MessageGenerated';
import { MessageForm } from '../MessageForm/MessageForm';
import { MessageActions } from '../MessageActions/MessageActions';

interface MessageProps {
  message: ChatMessage;
  chatId: ChatId;
}

export const Message = ({ message, chatId }: MessageProps) => {
  const isUser = message.type === 'regenerationRequest';

  const renderMessageContent = () => {
    switch (message.type) {
      case 'regenerationRequest':
        return <MessageRegen message={message} />;
      case 'generatedText':
        return <MessageGenerated message={message} />;
      case 'form':
        return <MessageForm chatId={chatId} message={message} />;
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
          'max-w-[75%] p-4 text-sm shadow-sm rounded-xl',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
          isUser ? 'rounded-br-none' : 'rounded-bl-none',
          message.type === 'form' && 'min-w-[75%]',
        )}
      >
        {renderMessageContent()}
      </div>
      <MessageActions chatId={chatId} message={message} />
    </div>
  );
};
