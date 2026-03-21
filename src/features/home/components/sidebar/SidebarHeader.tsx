import { Button } from '@/components/ui/button';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader as UISidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router';
import { HEADER_ITEMS } from '@/features/home/constants';

export const SidebarHeader = () => {
  const { open, toggleSidebar, isMobile } = useSidebar();

  const { pathname } = useLocation();

  return (
    <UISidebarHeader>
      <div className="flex justify-end-safe">
        <Button variant={'ghost'} size={open ? 'icon-lg' : 'icon-sm'} asChild>
          <SidebarTrigger />
        </Button>
      </div>

      <SidebarMenu>
        {HEADER_ITEMS.map(({ title, Icon, url }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton
              isActive={pathname === url}
              tooltip={title}
              asChild
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <Link to={url}>
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
