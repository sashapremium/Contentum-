import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router';
import type { Chat } from '../types/chat.types';

import { Ellipsis, SquarePen, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem = ({ chat }: ChatItemProps) => {
  const { pathname } = useLocation();
  const isSelected = pathname === `/chat/${chat.id}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isSelected}
        className="group place-content-between"
      >
        <Link to={`/chat/${chat.id}`}>
          <span className="truncate">{chat.title}</span>

          {isSelected && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis className="h-5 w-5" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" sideOffset={4}>
                <DropdownMenuItem>
                  <SquarePen />
                  Переименовать
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
