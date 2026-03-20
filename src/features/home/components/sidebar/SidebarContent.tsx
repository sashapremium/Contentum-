import {
  SidebarContent as UISidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { ChatList } from '@/features/chat/components/ChatList';

export const SidebarContent = () => {
  return (
    <UISidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Ваши чаты</SidebarGroupLabel>
        <SidebarGroupContent>
          <ChatList />
        </SidebarGroupContent>
      </SidebarGroup>
    </UISidebarContent>
  );
};
