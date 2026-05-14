import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEvent } from '../api';
import type { Event, EventUpdateRequest } from '../types';
import { EVENT_QUERY_KEYS } from './events.queryKeys';

interface UpdateEventVariables {
  id: number;
  payload: EventUpdateRequest;
}

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Event, unknown, UpdateEventVariables>({
    mutationFn: ({ id, payload }) => updateEvent(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: EVENT_QUERY_KEYS.list(),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: EVENT_QUERY_KEYS.detail(String(id)),
        exact: true,
      });
    },
  });
};
