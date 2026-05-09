import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTemplate } from '../api';
import type { TemplateDeleteResponse } from '../types';
import { BRANDBOOK_QUERY_KEYS } from '@/features/brandbooks/queries/brandbook.queryKeys';
import { PHOTOS_QUERY_KEYS } from '@/features/photo/queries/photos.queryKeys';
import { TEMPLATE_QUERY_KEYS } from './template.queryKeys';

interface DeleteTemplateMutationVariables {
  theatreId: number;
  templateId: string;
}

export const useDeleteTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TemplateDeleteResponse, unknown, DeleteTemplateMutationVariables>({
    mutationFn: ({ theatreId, templateId }) => deleteTemplate(theatreId, templateId),
    onSuccess: (_, { theatreId, templateId }) => {
      queryClient.invalidateQueries({
        queryKey: BRANDBOOK_QUERY_KEYS.detail(theatreId),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: PHOTOS_QUERY_KEYS.sessions(),
        exact: true,
      });
      queryClient.removeQueries({
        queryKey: TEMPLATE_QUERY_KEYS.detail(theatreId, templateId),
        exact: true,
      });
    },
  });
};
