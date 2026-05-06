import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTheatre } from '../api';
import type { Theatre, TheatreCreateRequest } from '../types';
import { THEATRE_QUERY_KEYS } from './theatre.queryKeys';

export const useCreateTheatreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Theatre, unknown, TheatreCreateRequest>({
    mutationFn: createTheatre,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: THEATRE_QUERY_KEYS.list(),
        exact: true,
      });
    },
  });
};
