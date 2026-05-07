import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePhotoSession, type PhotoSessionGenerateWithAssetsPayload } from '../api/photos.api';
import type {
  PhotoSessionGenerateResponse,
  PhotoSessionRenameResponse,
  PhotoSessionUpdateRequest,
} from '../types/photos.types';
import { PHOTOS_QUERY_KEYS } from './photos.queryKeys';

interface UpdatePhotoSessionMutationVariables {
  id: string;
  payload: PhotoSessionUpdateRequest | PhotoSessionGenerateWithAssetsPayload;
}

export const useUpdatePhotoSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PhotoSessionRenameResponse | PhotoSessionGenerateResponse,
    unknown,
    UpdatePhotoSessionMutationVariables
  >({
    mutationFn: ({ id, payload }) => updatePhotoSession(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PHOTOS_QUERY_KEYS.sessions(),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: PHOTOS_QUERY_KEYS.sessionDetail(variables.id),
        exact: true,
      });
    },
  });
};
