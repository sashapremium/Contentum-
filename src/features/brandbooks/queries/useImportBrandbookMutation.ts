import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importBrandbook } from '../api';
import type { Brandbook } from '../types';
import { BRANDBOOK_QUERY_KEYS } from './brandbook.queryKeys';

interface ImportBrandbookVariables {
  theatreId: number;
  file: File;
}

export const useImportBrandbookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Brandbook, unknown, ImportBrandbookVariables>({
    mutationFn: ({ theatreId, file }) => importBrandbook(theatreId, file),
    onSuccess: (_, { theatreId }) => {
      queryClient.invalidateQueries({
        queryKey: BRANDBOOK_QUERY_KEYS.detail(theatreId),
        exact: true,
      });
    },
  });
};
