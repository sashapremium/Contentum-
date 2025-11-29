import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Ellipsis } from 'lucide-react';
import { useInfo, useError, useSuccess } from '@/hooks/useToast';

export const HomeHeader = () => {
  const i = useInfo();
  const e = useError();
  const s = useSuccess();

  return (
    <header className="border-b p-3 bg-background grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <SidebarTrigger />

      <h1 className="font-medium text-lg truncate">Новый чат</h1>

      <Button variant="ghost" size="icon-sm">
        <Ellipsis />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => s('Message in toast component')}
      >
        <Ellipsis />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => i('Message in toast component')}
      >
        <Ellipsis />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => e('Message in toast component')}
      >
        <Ellipsis />
      </Button>
    </header>
  );
};
