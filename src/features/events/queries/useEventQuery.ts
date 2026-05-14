import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../api';
import type { Event } from '../types';
import { EVENT_QUERY_KEYS } from './events.queryKeys';

export const useEventQuery = (id: string) => {
  return useQuery<Event>({
    queryKey: EVENT_QUERY_KEYS.detail(id),
    queryFn: () => fetchEvent(id),
    enabled: Boolean(id),
  });
};
