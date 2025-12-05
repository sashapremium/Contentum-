import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import { ArrowUpIcon } from 'lucide-react';
import { useSendMessageMutation } from '../queries/useSendMessageMutation';
import { useState } from 'react';

interface MessageInputProps {
  chatId: string;
  mutation: ReturnType<typeof useSendMessageMutation>;
}

export const MessageInput = ({ chatId, mutation }: MessageInputProps) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;

    mutation.mutate({
      chat: chatId,
      content: value,
      messageType: 'USER',
    });

    setValue('');
  };

  console.log('MessageInput', { isPending: mutation.isPending });
  return (
    <div className="z-2 bg-background sticky bottom-0 pb-6">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Введите ваше сообщение..."
          value={value}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onChange={(e) => setValue(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-sm"
            onClick={handleSend}
            disabled={mutation.isPending || !value.trim()}
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
