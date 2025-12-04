import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

interface HomeHeaderProps {
  children: ReactNode;
}

export const MainHeader = ({ children }: HomeHeaderProps) => {
  const { isMobile } = useSidebar();

  return (
    <header className="border-b p-3 bg-background">
      {isMobile && <SidebarTrigger />}
      {children}
    </header>
  );
};
