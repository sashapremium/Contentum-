import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router';
import type { Chat } from '../types/chat.types';

import { ChatActionDropdown } from './ChatActionDropdown';
import { POST_PREFIX } from '@/app/router/routes';

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem = ({ chat }: ChatItemProps) => {
  const { pathname } = useLocation();
  const isSelected = pathname === `${POST_PREFIX}${chat.id}`;

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton
        isActive={isSelected}
        className="group place-content-between"
        asChild
      >
        <Link to={`${POST_PREFIX}${chat.id}`}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>
      <ChatActionDropdown chat={chat} />
    </SidebarMenuItem>
  );
};
