import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import { ArrowUpIcon, Plus } from 'lucide-react';
import { useSendMessageMutation } from '../queries/useSendMessageMutation';
import { useState } from 'react';
import { useTodo } from '@/hooks/useToast';

interface MessageInputProps {
  chatId: string;
  mutation: ReturnType<typeof useSendMessageMutation>;
}

export const MessageInput = ({ chatId, mutation }: MessageInputProps) => {
  const [value, setValue] = useState('');
  const t = useTodo();

  const handleSend = () => {
    if (!value.trim()) return;

    mutation.mutate({
      chat: chatId,
      content: value,
      messageType: 'USER',
    });

    setValue('');
  };

  return (
    <div className="z-2 bg-background sticky bottom-0 pb-6">
      <InputGroup className="rounded-xl items-start">
        <InputGroupAddon align="inline-start" className="pl-6 py-4">
          <InputGroupButton
            variant="default"
            size="icon-sm"
            onClick={() => t('Загрузка файлов')}
          >
            <Plus />
          </InputGroupButton>
        </InputGroupAddon>

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
          className="md:text-base p-5 max-h-72 overflow-y-auto textarea-scroll"
        />

        <InputGroupAddon align="inline-end" className="pr-6 py-4">
          <InputGroupButton
            variant="default"
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
