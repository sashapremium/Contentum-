import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChat } from '../api/chat.api';
import type { ChatUpdateRequest, Chat } from '../types/chat.types';
import { CHAT_QUERY_KEYS } from '@/features/chat/hooks/queryKeys';

interface UpdateChatVariables {
  id: string;
  data: ChatUpdateRequest;
}

export const useUpdateChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Chat, unknown, UpdateChatVariables>({
    mutationFn: ({ id, data }) => updateChat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.all });
    },
  });
};
