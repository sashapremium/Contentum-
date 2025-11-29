import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  SidebarFooter as UISidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const USER = {
  name: 'Куликов Пётр Сергеевич',
  email: 'p.kulikov.dev@gmail.com',
};

export const SidebarFooter = () => {
  return (
    <UISidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">PK</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{USER.name}</span>
              <span className="truncate text-xs">{USER.email}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </UISidebarFooter>
  );
};
