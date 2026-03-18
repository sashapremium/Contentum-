import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router';
import type { Chat } from '../types/chat.types';

import { ChatActionDropdown } from './ChatActionDropdown';

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem = ({ chat }: ChatItemProps) => {
  const { pathname } = useLocation();
  const isSelected = pathname === `/chat/${chat.id}`;

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton
        isActive={isSelected}
        className="group place-content-between"
        asChild
      >
        <Link to={`/chat/${chat.id}`}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>
      <ChatActionDropdown chat={chat} />
    </SidebarMenuItem>
  );
};
