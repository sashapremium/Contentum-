import type { Message } from '../../types/messages.types';
import { CopyAction } from './CopyAction';
import { DowloadAction } from './DownloadAction';

export interface MessageActionsProps {
  message: Message;
}

export const MessageActions = ({ message }: MessageActionsProps) => {
  return (
    <div className="flex gap-2 mt-1 px-1 opacity-0 transition group-hover:opacity-100">
      {message.content.type === 'text' && <CopyAction message={message} />}

      {message.content.type === 'image' && <DowloadAction message={message} />}
    </div>
  );
};
