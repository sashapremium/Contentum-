// Mutation для запуска перегенерации сообщения. После успеха инвалидирует кэш чатов.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reegenerateMessage } from '../api/briefs.api';
import type {
  ChatId,
  ChatUpdateResponse,
} from '@/features/chat/types/chat.types';
import type { RegenerateMessageRequest } from '../types/briefs.types';
import { CHAT_QUERY_KEYS } from '@/features/chat/queries/chat.queryKeys';

interface RegenerateVariables {
  id: ChatId;
  data: RegenerateMessageRequest;
}

export const useRegenerateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatUpdateResponse, unknown, RegenerateVariables>({
    mutationFn: ({ id, data }) => reegenerateMessage(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.all,
        exact: false,
      });
    },
  });
};
