import { useQuery } from '@tanstack/react-query';
import { fetchPhotoSessions } from '../api/photos.api';
import type { PhotoSessionsListResponse } from '../types/photos.types';
import { PHOTOS_QUERY_KEYS } from './photos.queryKeys';

export const usePhotoSessionsQuery = () => {
  return useQuery<PhotoSessionsListResponse>({
    queryKey: PHOTOS_QUERY_KEYS.sessions(),
    queryFn: fetchPhotoSessions,
  });
};
