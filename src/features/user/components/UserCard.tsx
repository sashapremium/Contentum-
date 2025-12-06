import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoutDialog } from '@/features/home/components/sidebar/LogoutDialog';
import { useTodo } from '@/hooks/useToast';
import { User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

const USER = {
  name: 'Куликов Глубокослав Сергеевич',
  email: 'p.kulikov.dev@gmaiффффффффффффl.com',
};

export const UserCard = () => {
  const [open, setOpen] = useState(false);
  const t = useTodo();

  const loading = true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight gap-1">
            {loading ? (
              <Skeleton className="w-[180px] h-[17.5px]" />
            ) : (
              <span className="truncate font-medium">{USER.name}</span>
            )}

            {loading ? (
              <Skeleton className="w-[150px] h-[14px]" />
            ) : (
              <span className="truncate text-xs">{USER.email}</span>
            )}
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
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
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <LogOut />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>

      <LogoutDialog open={open} onOpenChange={setOpen} />
    </DropdownMenu>
  );
};
