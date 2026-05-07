import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTemplate, type TemplateWithAssetsPayload } from '../api';
import type { Template } from '../types';
import { BRANDBOOK_QUERY_KEYS } from '@/features/brandbooks/queries/brandbook.queryKeys';
import { TEMPLATE_QUERY_KEYS } from './template.queryKeys';

interface UpdateTemplateMutationVariables {
  theatreId: number;
  templateId: string;
  payload: Template | TemplateWithAssetsPayload;
}

export const useUpdateTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Template, unknown, UpdateTemplateMutationVariables>({
    mutationFn: ({ theatreId, templateId, payload }) =>
      updateTemplate(theatreId, templateId, payload),
    onSuccess: (_, { theatreId, templateId }) => {
      queryClient.invalidateQueries({
        queryKey: BRANDBOOK_QUERY_KEYS.detail(theatreId),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: TEMPLATE_QUERY_KEYS.detail(theatreId, templateId),
        exact: true,
      });
    },
  });
};
