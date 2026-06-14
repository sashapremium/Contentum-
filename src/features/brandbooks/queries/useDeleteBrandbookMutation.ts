// Mutation для удаления брендбука учреждения. После успеха удаляет запись из кэша.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBrandbook } from '../api';
import type { BrandbookDeleteResponse } from '../types';
import { BRANDBOOK_QUERY_KEYS } from './brandbook.queryKeys';

export const useDeleteBrandbookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<BrandbookDeleteResponse, unknown, number>({
    mutationFn: deleteBrandbook,
    onSuccess: (_, theatreId) => {
      queryClient.removeQueries({
        queryKey: BRANDBOOK_QUERY_KEYS.detail(theatreId),
        exact: true,
      });
    },
  });
};
