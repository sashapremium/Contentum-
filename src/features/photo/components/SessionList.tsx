// Список фото-сессий в sidebar. Во время загрузки показывает 5 skeleton-заглушек.

import { Skeleton } from '@/components/ui/skeleton';
import { SidebarMenu } from '@/components/ui/sidebar';
import { usePhotoSessionsQuery } from '../queries/usePhotoSessionsQuery';
import { SessionItem } from './SessionItem';

export const SessionList = () => {
  const { data, isLoading } = usePhotoSessionsQuery();

  return (
    <SidebarMenu className="gap-2">
      {isLoading &&
        Array.from(Object({ length: 5 })).map((_, i) => (
          <Skeleton className="h-8" key={i} />
        ))}
      {data?.sessions.map((session) => (
        <SessionItem key={session.id} session={session} />
      ))}
    </SidebarMenu>
  );
};
