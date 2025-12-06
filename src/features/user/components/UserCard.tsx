import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { User, UserCog } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useUserMeQuery } from '../queries/useUserMeQuery';
import { Error } from '@/components/shared/Error';
import { mapApiError } from '@/lib/apiErrorMapper';

export const UserCard = () => {
  const { data: user, isLoading, isError, error } = useUserMeQuery();

  if (isError) {
    return (
      <Error
        description={mapApiError(
          error,
          'Ошибка при загрузке данных о пользователе.'
        )}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            {isLoading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <AvatarFallback className="rounded-lg">
                {user?.role === 'EMPLOYEE' ? <User /> : <UserCog />}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight gap-1">
            {isLoading ? (
              <Skeleton className="w-[180px] h-[17.5px]" />
            ) : (
              <span className="truncate font-medium">{user?.fullName}</span>
            )}

            {isLoading ? (
              <Skeleton className="w-[150px] h-[14px]" />
            ) : (
              <span className="truncate text-xs">{user?.email}</span>
            )}
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <UserMenu />
    </DropdownMenu>
  );
};
