import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent } from '../api';
import type { Event, EventCreateRequest } from '../types';
import { EVENT_QUERY_KEYS } from './events.queryKeys';

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Event, unknown, EventCreateRequest>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EVENT_QUERY_KEYS.list(),
        exact: true,
      });
    },
  });
};
