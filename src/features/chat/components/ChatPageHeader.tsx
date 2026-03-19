import { MainHeader } from '@/components/shared/MainHeader';
import type { ChatProps } from '../types/chat.types';

export const ChatPageHeader = ({ chat }: ChatProps) => {
  return (
    <MainHeader>
      <h1 className="truncate">{chat?.title}</h1>
    </MainHeader>
  );
};
