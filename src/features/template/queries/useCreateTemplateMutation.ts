import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplate, type TemplateWithAssetsPayload } from '../api';
import type { Template } from '../types';
import { BRANDBOOK_QUERY_KEYS } from '@/features/brandbooks/queries/brandbook.queryKeys';

interface CreateTemplateMutationVariables {
  theatreId: number;
  payload: Template | TemplateWithAssetsPayload;
}

export const useCreateTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Template, unknown, CreateTemplateMutationVariables>({
    mutationFn: ({ theatreId, payload }) => createTemplate(theatreId, payload),
    onSuccess: (_, { theatreId }) => {
      queryClient.invalidateQueries({
        queryKey: BRANDBOOK_QUERY_KEYS.detail(theatreId),
        exact: true,
      });
    },
  });
};
