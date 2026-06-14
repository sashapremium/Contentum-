// Layout с SidebarProvider: sidebar слева, основной контент в SidebarInset справа.

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { HomeSidebar } from '../sidebar/HomeSidebar';

export const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
