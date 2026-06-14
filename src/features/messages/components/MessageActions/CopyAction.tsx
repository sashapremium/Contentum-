// Кнопка копирования текста в буфер. После клика 2 секунды показывает иконку Check вместо Copy.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button } from '@/components/ui/button';
import type { MessageActionsProps } from './MessageActions';
import { Check, Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

export const CopyAction = ({ message }: MessageActionsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    const text = message.content.info as string;
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </TooltipTrigger>

      <TooltipContent showArrow={false} side="bottom" className="p-1">
        <span className="font-medium">Копировать</span>
      </TooltipContent>
    </Tooltip>
  );
};
