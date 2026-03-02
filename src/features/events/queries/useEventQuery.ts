import { useQuery } from '@tanstack/react-query';
import type { Event } from '../types';
import { fetchEvent } from '../api';

export const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  byId: (id: string) => [...EVENT_QUERY_KEYS.all, id] as const,
};

export const useEventQuery = (id: string) => {
  return useQuery<Event>({
    queryKey: EVENT_QUERY_KEYS.byId(id),
    queryFn: () => fetchEvent(id),
    enabled: Boolean(id),
  });
};
