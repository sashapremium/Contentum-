import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTodo } from '@/hooks/useToast';
import { Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { LogoutDialog } from './LogoutDialog';

export const UserMenu = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const t = useTodo();

  return (
    <>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="top"
        align="center"
        sideOffset={4}
      >
        <DropdownMenuItem onClick={() => t('Настройки')}>
          <Settings />
          Настройки
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
          <LogOut />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
};
