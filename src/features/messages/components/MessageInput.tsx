import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import { ArrowUpIcon } from 'lucide-react';

export const MessageInput = () => {
  return (
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
  );
};
