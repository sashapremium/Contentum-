// Элемент списка чата в sidebar: название, выделение активного, dropdown с действиями.
// На мобильных при переходе закрывает sidebar.
import {
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router';
import type { Chat } from '../types/chat.types';

import { ChatActionDropdown } from './ChatActionDropdown';
import { POST } from '@/app/router/routes';

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem = ({ chat }: ChatItemProps) => {
  const { pathname } = useLocation();
  const isSelected = pathname === `${POST}/${chat.id}`;
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton
        onClick={isMobile ? toggleSidebar : undefined}
        isActive={isSelected}
        className="group place-content-between"
        asChild
      >
        <Link to={`${POST}/${chat.id}`}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>
      <ChatActionDropdown chat={chat} />
    </SidebarMenuItem>
  );
};
