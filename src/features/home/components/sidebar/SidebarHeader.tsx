import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader as UISidebarHeader,
} from '@/components/ui/sidebar';
import { Search, SquarePen, Image } from 'lucide-react';
import { Link } from 'react-router';

const HEADER_ITEMS = [
  {
    title: 'Новый чат',
    icon: SquarePen,
    url: '/',
  },
  {
    title: 'Поиск по чатам',
    icon: Search,
    url: '#',
  },
  {
    title: 'Галерея',
    icon: Image,
    url: '#',
  },
];

export const SidebarHeader = () => {
  return (
    <UISidebarHeader>
      <SidebarMenu>
        {HEADER_ITEMS.map((item) => (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.title}>
              <item.icon />
              <Link to={item.url}>{item.title}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </UISidebarHeader>
  );
};
