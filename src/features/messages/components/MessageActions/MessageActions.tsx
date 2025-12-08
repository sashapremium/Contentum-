import type { Message } from '../../types/messages.types';
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSuccess } from '@/hooks/useToast';

interface MessageActionsProps {
  message: Message;
}

export const MessageActions = ({ message }: MessageActionsProps) => {
  const s = useSuccess();

  const handleCopy = () => {
    const text = message.content.info as string;
    navigator.clipboard.writeText(text);
    s('Сообщение скопировано');
  };

  return (
    <div className="flex gap-2 mt-1 px-1 opacity-0 transition group-hover:opacity-100">
      {message.content.type === 'text' && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
        >
          <Copy />
        </Button>
      )}

      {message.content.type === 'image' && (
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <a download href={message.content.info.download_url}>
            <Download />
          </a>
        </Button>
      )}
    </div>
  );
};
