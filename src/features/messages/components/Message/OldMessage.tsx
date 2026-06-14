// Устаревший компонент для сообщений типа Message (text/image из messages.types).
// Используется отдельно от основного чата - рендерит текст или MessageImage.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type {
  ImageInfo,
  Message as MessageType,
} from '../../types/messages.types';
import { cx } from 'class-variance-authority';
import { MessageImage } from './MessageImage';
import { MessageActions } from '../MessageActions/MessageActions';

interface MessageProps {
  message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.messageType === 'USER';

  const renderTextMessage = () => {
    return (
      <div
        className={cx(
          'max-w-[75%] px-4 py-2 text-sm shadow-sm rounded-xl',

          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',

          isUser ? 'rounded-br-none' : 'rounded-bl-none',
        )}
      >
        {message.content.info as string}
      </div>
    );
  };

  const renderImageMessage = () => {
    const info = message.content.info as ImageInfo;

    return <MessageImage info={info} />;
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
      className={cx(
        'group',
        'flex flex-col',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      {renderMessageContent()}

      <MessageActions message={message} />
    </div>
  );
};
