import { MainHeader } from '@/components/shared/MainHeader';
import type { ChatProps } from '../types/chat.types';
import { ChatActionDropdown } from './ChatActionDropdown';

export const ChatPageHeader = ({ chat }: ChatProps) => {
  return (
    <MainHeader>
      <div className="flex flex-1 justify-between">
        <h1 className="truncate">{chat?.title}</h1>
        <ChatActionDropdown chat={chat!} />
      </div>
    </MainHeader>
  );
};
