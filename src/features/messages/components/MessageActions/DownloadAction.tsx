// Кнопка скачивания изображения через ссылку

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Button } from '@/components/ui/button';
import type { MessageActionsProps } from './MessageActions';
import type { ImageInfo } from '../../types/messages.types';
import { Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const DowloadAction = ({ message }: MessageActionsProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <a download href={(message.content.info as ImageInfo).download_url}>
            <Download />
          </a>
        </Button>
      </TooltipTrigger>

      <TooltipContent showArrow={false} side="bottom" className="p-1">
        <span className="font-medium">Скачать</span>
      </TooltipContent>
    </Tooltip>
  );
};
