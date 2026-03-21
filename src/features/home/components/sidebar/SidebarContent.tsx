import { PHOTO, POST } from '@/app/router/routes';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarContent as UISidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { ChatList } from '@/features/chat/components/ChatList';
import { SessionList } from '@/features/photo/components/SessionList';
import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router';

const SIDEBAR_ITEMS = [
  { title: 'Посты', url: POST, content: <ChatList /> },
  { title: 'Изображения', url: PHOTO, content: <SessionList /> },
];

export const SidebarContent = () => {
  const { pathname } = useLocation();

  return (
    <UISidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Ваши чаты</SidebarGroupLabel>
        <SidebarGroupContent>
          {SIDEBAR_ITEMS.map(({ title, content, url }) => (
            <Collapsible
              defaultOpen={pathname.startsWith(url)}
              key={title}
              title={title}
              className="group/collapsible"
            >
              <SidebarGroup className="gap-2">
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {title}{' '}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>{content}</SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </UISidebarContent>
  );
};
