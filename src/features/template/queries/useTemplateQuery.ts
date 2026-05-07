import { useQuery } from '@tanstack/react-query';
import { fetchTemplate } from '../api';
import type { Template } from '../types';
import { TEMPLATE_QUERY_KEYS } from './template.queryKeys';

export const useTemplateQuery = (
  theatreId: number | undefined,
  templateId: string | undefined,
) => {
  return useQuery<Template>({
    queryKey: TEMPLATE_QUERY_KEYS.detail(theatreId!, templateId!),
    queryFn: () => fetchTemplate(theatreId!, templateId!),
    enabled: theatreId !== undefined && templateId !== undefined,
  });
};
