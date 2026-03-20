import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPhotoSessionSourceImage } from '../api/photos.api';
import type { PhotoSessionUploadResponse } from '../types/photos.types';
import { PHOTOS_QUERY_KEYS } from './photos.queryKeys';

interface UploadPhotoSessionSourceImageMutationVariables {
  id: string;
  file: File;
}

export const useUploadPhotoSessionSourceImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PhotoSessionUploadResponse,
    unknown,
    UploadPhotoSessionSourceImageMutationVariables
  >({
    mutationFn: ({ id, file }) => uploadPhotoSessionSourceImage(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PHOTOS_QUERY_KEYS.sessionDetail(variables.id),
        exact: true,
      });
    },
  });
};
