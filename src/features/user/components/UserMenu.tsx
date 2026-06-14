// Dropdown-меню пользователя с кнопкой выхода. Открывает LogoutDialog.

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { LogoutDialog } from './LogoutDialog';

export const UserMenu = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="top"
        align="center"
        sideOffset={4}
      >
        <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
          <LogOut />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
};
