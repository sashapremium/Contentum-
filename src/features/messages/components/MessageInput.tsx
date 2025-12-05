import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import type { ChatProps } from '@/features/chat/types/chat.types';
import { ArrowUpIcon } from 'lucide-react';

export const MessageInput = ({ props }: ChatProps) => {
  return (
    <div className="z-2 bg-background sticky bottom-0 pb-6">
      <InputGroup>
        <InputGroupTextarea placeholder="Введите ваше сообщение..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-sm"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
