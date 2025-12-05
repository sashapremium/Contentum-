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
import { useNavigate } from 'react-router';

const HEADER_ITEMS = [
  {
    title: 'Создать чат',
    icon: SquarePen,
    url: '/',
  },
];

export const SidebarHeader = () => {
  const navigate = useNavigate();
  const { open } = useSidebar();

  return (
    <UISidebarHeader>
      <div className="flex justify-end-safe">
        <Button variant={'ghost'} size={open ? 'icon-lg' : 'icon-sm'} asChild>
          <SidebarTrigger />
        </Button>
      </div>

      <SidebarMenu>
        {HEADER_ITEMS.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => navigate('/')}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </UISidebarHeader>
  );
};
