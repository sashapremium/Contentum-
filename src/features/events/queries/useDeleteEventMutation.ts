import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvent } from '../api';
import type { EventDeleteResponse } from '../types';
import { EVENT_QUERY_KEYS } from './events.queryKeys';

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EventDeleteResponse, unknown, number>({
    mutationFn: deleteEvent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: EVENT_QUERY_KEYS.list(),
        exact: true,
      });

      queryClient.removeQueries({
        queryKey: EVENT_QUERY_KEYS.detail(String(id)),
        exact: true,
      });
    },
  });
};
