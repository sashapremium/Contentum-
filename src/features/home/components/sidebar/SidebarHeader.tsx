import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader as UISidebarHeader,
} from '@/components/ui/sidebar';
import { SquarePen } from 'lucide-react';
import { useNavigate } from 'react-router';

const HEADER_ITEMS = [
  {
    title: 'Новый чат',
    icon: SquarePen,
    url: '/',
  },
];

export const SidebarHeader = () => {
  const navigate = useNavigate();

  return (
    <UISidebarHeader>
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
