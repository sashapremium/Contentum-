import {
  SidebarContent as UISidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Link } from 'react-router';

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

export const SidebarContent = () => {
  return (
    <UISidebarContent>
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
    </UISidebarContent>
  );
};
