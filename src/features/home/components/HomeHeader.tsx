import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Ellipsis } from 'lucide-react';

export const HomeHeader = () => {
  return (
    <header className="border-b p-3 bg-background grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <SidebarTrigger />

      <h1 className="font-medium text-lg truncate">Новый чат</h1>

      <Button variant="ghost" size="icon-sm">
        <Ellipsis />
      </Button>
    </header>
  );
};
