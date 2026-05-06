import { useQuery } from '@tanstack/react-query';
import { fetchTheatres } from '../api';
import type { TheatreListResponse } from '../types';
import { THEATRE_QUERY_KEYS } from './theatre.queryKeys';

export const useTheatresQuery = () => {
  return useQuery<TheatreListResponse>({
    queryKey: THEATRE_QUERY_KEYS.list(),
    queryFn: fetchTheatres,
  });
};
