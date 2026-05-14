import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../api';
import type { EventListResponse } from '../types';
import { EVENT_QUERY_KEYS } from './events.queryKeys';

export const useEventsQuery = () => {
  return useQuery<EventListResponse>({
    queryKey: EVENT_QUERY_KEYS.list(),
    queryFn: fetchEvents,
  });
};
