// Mutation для переименования чата. После успеха инвалидирует список чатов.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChatRenameRequest } from '../types/chat.types';
import { renameChat } from '../api/chat.api';
import { CHAT_QUERY_KEYS } from './chat.queryKeys';

export const useRenameChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChatRenameRequest }) =>
      renameChat(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.all,
        exact: false,
      });
    },
  });
};
