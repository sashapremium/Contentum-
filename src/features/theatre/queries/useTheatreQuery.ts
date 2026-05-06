import { useQuery } from '@tanstack/react-query';
import { fetchTheatre } from '../api';
import type { Theatre } from '../types';
import { THEATRE_QUERY_KEYS } from './theatre.queryKeys';

export const useTheatreQuery = (id: number | undefined) => {
  return useQuery<Theatre>({
    queryKey: THEATRE_QUERY_KEYS.detail(id!),
    queryFn: () => fetchTheatre(id!),
    enabled: id !== undefined,
  });
};
