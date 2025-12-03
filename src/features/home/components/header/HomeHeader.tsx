import { SidebarTrigger } from '@/components/ui/sidebar';

export const HomeHeader = () => {
  return (
    <header className="border-b p-3 bg-background grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <SidebarTrigger />
    </header>
  );
};
