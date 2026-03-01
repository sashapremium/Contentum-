import { Skeleton } from '@/components/ui/skeleton';
import { ChatItem } from './ChatItem';
import { SidebarMenu } from '@/components/ui/sidebar';
import { useChatsQuery } from '../queries/useChatsQuery';

export const ChatList = () => {
  const { data, isLoading } = useChatsQuery();

  return (
    <SidebarMenu className="gap-2">
      {isLoading &&
        Array.from(Object({ length: 5 })).map((_, i) => (
          <Skeleton className="h-8" key={i} />
        ))}
      {data?.chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </SidebarMenu>
  );
};
