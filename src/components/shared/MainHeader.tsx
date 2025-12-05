import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

interface HomeHeaderProps {
  children?: ReactNode;
}
// test
export const MainHeader = ({ children }: HomeHeaderProps) => {
  const { isMobile } = useSidebar();

  return (
    <header className="z-2 bg-background sticky top-0 flex shrink-0 items-center border-b p-3 bg-background gap-2">
      {isMobile && <SidebarTrigger />}
      {children}
    </header>
  );
};
