import {
  POST_CREATE,
  PHOTO_CREATE,
  GALLERY,
  THEATRE,
  POST_TITLE,
  PHOTO_TITLE,
  GALLERY_TITLE,
  THEATRE_TITLE,
} from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader as UISidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Image, Images, Landmark, SquarePen } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const HEADER_ITEMS = [
  {
    title: POST_TITLE,
    Icon: SquarePen,
    path: POST_CREATE,
  },
  {
    title: PHOTO_TITLE,
    Icon: Image,
    path: PHOTO_CREATE,
  },
  {
    title: GALLERY_TITLE,
    Icon: Images,
    path: GALLERY,
  },
  {
    title: THEATRE_TITLE,
    Icon: Landmark,
    path: THEATRE,
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
