import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePhotoSession } from '../api/photos.api';
import { PHOTOS_QUERY_KEYS } from './photos.queryKeys';

export const useDeletePhotoSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: deletePhotoSession,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: PHOTOS_QUERY_KEYS.sessions(),
        exact: true,
      });

      queryClient.removeQueries({
        queryKey: PHOTOS_QUERY_KEYS.sessionDetail(id),
        exact: true,
      });
    },
  });
};
