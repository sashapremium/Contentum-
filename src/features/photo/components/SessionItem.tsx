// Элемент сессии в sidebar: ссылка, active state по pathname, закрывает sidebar на мобильных при клике.

import {
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router';

import { PHOTO } from '@/app/router/routes';
import type { PhotoSessionListItem } from '../types/photos.types';
import { SessionActionDropdown } from './SessionActionDropdown';

interface SessionItemProps {
  session: PhotoSessionListItem;
}

export const SessionItem = ({ session }: SessionItemProps) => {
  const { pathname } = useLocation();
  const isSelected = pathname === `${PHOTO}/${session.id}`;
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton
        onClick={isMobile ? toggleSidebar : undefined}
        isActive={isSelected}
        className="group place-content-between"
        asChild
      >
        <Link to={`${PHOTO}/${session.id}`}>
          <span>{session.title}</span>
        </Link>
      </SidebarMenuButton>
      <SessionActionDropdown session={session} />
    </SidebarMenuItem>
  );
};
