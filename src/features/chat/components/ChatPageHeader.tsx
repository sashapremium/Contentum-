import { MainHeader } from '@/components/shared/MainHeader';
import type { Chat } from '../types/chat.types';
import { ChatActionDropdown } from './ChatActionDropdown';

interface ChatPageHeaderProps {
  chat: Chat | undefined;
}

export const ChatPageHeader = ({ chat }: ChatPageHeaderProps) => {
  return (
    <MainHeader>
      <div className="flex justify-between">
        <h1 className="truncate">{chat?.title}</h1>
        <ChatActionDropdown chat={chat!} />
      </div>
    </MainHeader>
  );
};
