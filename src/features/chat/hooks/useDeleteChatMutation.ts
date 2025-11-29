import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChat } from '../api/chat.api';
import { CHAT_QUERY_KEYS } from '@/features/chat/hooks/queryKeys';

export const useDeleteChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: (id) => deleteChat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.all });
    },
  });
};
