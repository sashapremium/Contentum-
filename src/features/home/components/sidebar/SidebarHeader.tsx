import { CHAT_CREATE } from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader as UISidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { SquarePen } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const HEADER_ITEMS = [
  {
    title: 'Создать чат',
    Icon: SquarePen,
    path: CHAT_CREATE,
  },
];

export const SidebarHeader = () => {
  const { open } = useSidebar();

  const { pathname } = useLocation();

  return (
    <UISidebarHeader>
      <div className="flex justify-end-safe">
        <Button variant={'ghost'} size={open ? 'icon-lg' : 'icon-sm'} asChild>
          <SidebarTrigger />
        </Button>
      </div>

      <SidebarMenu>
        {HEADER_ITEMS.map(({ title, Icon, path }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton
              isActive={pathname === path}
              tooltip={title}
              asChild
            >
              <Link to={path}>
                <Icon />
                <span>{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </UISidebarHeader>
  );
};
