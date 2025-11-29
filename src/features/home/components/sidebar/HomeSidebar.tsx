import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Image, Search, SquarePen } from 'lucide-react';
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

const CONTENT_ITEMS = [
  {
    title: 'История диалогов',
    items: [
      {
        title: 'Installation',
        url: '/chat/123',
      },
      {
        title: 'Project Structure',
        url: '/chat/123',
      },
      {
        title: 'Routing',
        url: '/chat/123',
      },
      {
        title: 'Data Fetching',
        url: '/chat/123',
        isActive: true,
      },
      {
        title: 'Rendering',
        url: '/chat/123',
      },
      {
        title: 'Caching',
        url: '/chat/123',
      },
      {
        title: 'Styling',
        url: '/chat/123',
      },
      {
        title: 'Optimizing long long long long loooooooong name',
        url: '/chat/123',
      },
      {
        title: 'Configuring',
        url: '/chat/123',
      },
      {
        title: 'Testing',
        url: '/chat/123',
      },
      {
        title: 'Authentication',
        url: '/chat/123',
      },
      {
        title: 'Deploying',
        url: '/chat/123',
      },
      {
        title: 'Upgrading',
        url: '/chat/123',
      },
      {
        title: 'Examples',
        url: '/chat/123',
      },
      {
        title: 'History',
        url: '/chat/123',
      },
      {
        title: 'Starred',
        url: '/chat/123',
      },
      {
        title: 'Settings',
        url: '/chat/123',
      },
      {
        title: 'Genesis',
        url: '/chat/123',
      },
      {
        title: 'Explorer',
        url: '/chat/123',
      },
      {
        title: 'Quantum',
        url: '/chat/123',
      },
      {
        title: 'Introduction',
        url: '/chat/123',
      },
      {
        title: 'Get Started',
        url: '/chat/123',
      },
      {
        title: 'Tutorials',
        url: '/chat/123',
      },
      {
        title: 'Changelog',
        url: '/chat/123',
      },
      {
        title: 'General',
        url: '/chat/123',
      },
      {
        title: 'Team',
        url: '/chat/123',
      },
      {
        title: 'Billing',
        url: '#',
      },
      {
        title: 'Limits',
        url: '#',
      },
      {
        title: 'Components',
        url: '#',
      },
      {
        title: 'File Conventions',
        url: '#',
      },
      {
        title: 'Functions',
        url: '#',
      },
      {
        title: 'next.config.js Options',
        url: '#',
      },
      {
        title: 'CLI',
        url: '#',
      },
      {
        title: 'Edge Runtime',
        url: '#',
      },
      {
        title: 'Accessibility',
        url: '#',
      },
      {
        title: 'Fast Refresh',
        url: '#',
      },
      {
        title: 'Next.js Compiler',
        url: '#',
      },
      {
        title: 'Supported Browsers',
        url: '#',
      },
      {
        title: 'Turbopack',
        url: '#',
      },
    ],
  },
];

const USER = {
  name: 'Куликов Пётр Сергеевич',
  email: 'p.kulikov.dev@gmail.com',
};

export function HomeSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
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
      </SidebarHeader>

      <SidebarContent>
        {CONTENT_ITEMS.map((item) => (
          <SidebarGroup
            key={item.title}
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
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
      </SidebarFooter>
    </Sidebar>
  );
}
