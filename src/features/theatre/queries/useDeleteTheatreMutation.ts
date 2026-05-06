import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTheatre } from '../api';
import type { TheatreDeleteResponse } from '../types';
import { THEATRE_QUERY_KEYS } from './theatre.queryKeys';

export const useDeleteTheatreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TheatreDeleteResponse, unknown, number>({
    mutationFn: deleteTheatre,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: THEATRE_QUERY_KEYS.list(),
        exact: true,
      });

      queryClient.removeQueries({
        queryKey: THEATRE_QUERY_KEYS.detail(id),
        exact: true,
      });
    },
  });
};
