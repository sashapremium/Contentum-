import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPhotoSession } from '../api/photos.api';
import type {
  PhotoSessionCreateRequest,
  PhotoSessionCreateResponse,
} from '../types/photos.types';
import { PHOTOS_QUERY_KEYS } from './photos.queryKeys';

export const useCreatePhotoSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PhotoSessionCreateResponse,
    unknown,
    PhotoSessionCreateRequest
  >({
    mutationFn: createPhotoSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PHOTOS_QUERY_KEYS.sessions(),
        exact: true,
      });
    },
  });
};
