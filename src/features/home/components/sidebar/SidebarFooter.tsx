// Footer sidebar: карточка текущего пользователя с меню выхода.

import {
  SidebarFooter as UISidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserCard } from '@/features/user/components/UserCard';

export const SidebarFooter = () => {
  return (
    <UISidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UserCard />
        </SidebarMenuItem>
      </SidebarMenu>
    </UISidebarFooter>
  );
};
