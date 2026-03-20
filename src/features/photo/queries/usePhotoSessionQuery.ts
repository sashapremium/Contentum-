import { useQuery } from '@tanstack/react-query';
import { fetchPhotoSession } from '../api/photos.api';
import { PHOTOS_QUERY_KEYS } from './photos.queryKeys';
import type { PhotoSession } from '../types/photos.types';

export const usePhotoSessionQuery = (id: string | undefined) => {
  return useQuery<PhotoSession>({
    queryKey: PHOTOS_QUERY_KEYS.sessionDetail(id!),
    queryFn: () => fetchPhotoSession(id!),
    enabled: Boolean(id),
  });
};
