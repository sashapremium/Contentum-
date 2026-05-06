import { useQuery } from '@tanstack/react-query';
import { fetchBrandbook } from '../api';
import type { Brandbook } from '../types';
import { BRANDBOOK_QUERY_KEYS } from './brandbook.queryKeys';

export const useBrandbookQuery = (theatreId: number | undefined) => {
  return useQuery<Brandbook>({
    queryKey: BRANDBOOK_QUERY_KEYS.detail(theatreId!),
    queryFn: () => fetchBrandbook(theatreId!),
    enabled: theatreId !== undefined,
  });
};
