import { SidebarTrigger } from '@/components/ui/sidebar';

export const HomeHeader = () => {
  return (
    <header className="border-b p-4 flex items-center justify-between bg-background ">
      <SidebarTrigger />
    </header>
  );
};
