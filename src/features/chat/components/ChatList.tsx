import { useChatsQuery } from '../hooks/useChatsQuery';
import { ChatItem } from './ChatItem';
import { SidebarMenu } from '@/components/ui/sidebar';

export const ChatList = () => {
  const { data, isLoading } = useChatsQuery();

  if (isLoading) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <SidebarMenu>
      {data?.results.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </SidebarMenu>
  );
};
