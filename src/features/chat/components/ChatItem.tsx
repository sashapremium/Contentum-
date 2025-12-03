import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useLocation, useNavigate } from 'react-router';
import type { Chat } from '../types/chat.types';

import { ChatActionDropdown } from './ChatActionDropdown';

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem = ({ chat }: ChatItemProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isSelected = pathname === `/chat/${chat.id}`;

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton
        isActive={isSelected}
        className="group place-content-between"
        onClick={() => {
          navigate(`/chat/${chat.id}`);
        }}
        asChild
      >
        <div className="cursor-pointer">
          <span className="truncate">{chat.title}</span>
          {isSelected && <ChatActionDropdown chat={chat} />}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
