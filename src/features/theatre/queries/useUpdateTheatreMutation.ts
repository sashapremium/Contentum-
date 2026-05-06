import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTheatre } from '../api';
import type { Theatre, TheatreCreateRequest } from '../types';
import { THEATRE_QUERY_KEYS } from './theatre.queryKeys';

interface UpdateTheatreVariables {
  id: number;
  payload: TheatreCreateRequest;
}

export const useUpdateTheatreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Theatre, unknown, UpdateTheatreVariables>({
    mutationFn: ({ id, payload }) => updateTheatre(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: THEATRE_QUERY_KEYS.list(),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: THEATRE_QUERY_KEYS.detail(id),
        exact: true,
      });
    },
  });
};
