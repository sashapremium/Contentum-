import { Sidebar } from '@/components/ui/sidebar';

export function HomeSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <Sidebar collapsible="offcanvas" {...props}></Sidebar>;
}
