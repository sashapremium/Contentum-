import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChat } from '../api/chat.api';
import { CHAT_QUERY_KEYS } from './chat.queryKeys';

export const useDeleteChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChat(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.all,
        exact: false,
      });
    },
  });
};
