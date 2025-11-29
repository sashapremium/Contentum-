import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { HomeSidebar } from './HomeSidebar';
import { HomeHeader } from './HomeHeader';
import { HomeContent } from './HomeContent';

export const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <HomeContent>{children}</HomeContent>
      </SidebarInset>
    </SidebarProvider>
  );
};
