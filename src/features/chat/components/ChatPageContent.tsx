import type { Chat } from '../types/chat.types';
import { Messages } from '@/features/messages/components/Messages';

interface ChatPageContentProps {
  chat: Chat | undefined;
}

export const ChatPageContent = ({}: ChatPageContentProps) => {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden px-4 pb-24 pt-4 sm:px-6 md:px-16 lg:px-32 xl:px-64">
      <div className="flex-1  pr-1">
        <Messages />
      </div>
    </section>
  );
};
