// Обёртка над EventInfo с загрузкой по id
import { Skeleton } from '@/components/ui/skeleton';
import { EventInfo } from './EventInfo';
import { useEventQuery } from '../queries/useEventQuery';
import { Error } from '@/components/shared/Error';

export const EventInfoById = ({ eventId }: { eventId: string }) => {
  const { data, isLoading, isError } = useEventQuery(eventId);

  if (!eventId) return null;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <Error description="Не удалось загрузить информацию о событии" />;
  }

  return <EventInfo event={data} />;
};
