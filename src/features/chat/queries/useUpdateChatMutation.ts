import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChat } from '../api/chat.api';
import type {
  ChatUpdateRequest,
  ChatUpdateResponse,
} from '../types/chat.types';
import { CHAT_QUERY_KEYS } from './chat.queryKeys';

export const UPDATE_CHAT_MUTATION_KEY = ['chat', 'update'] as const;

export interface UpdateChatVariables {
  id: string;
  data: ChatUpdateRequest;
}

export const useUpdateChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatUpdateResponse, unknown, UpdateChatVariables>({
    mutationKey: UPDATE_CHAT_MUTATION_KEY,
    mutationFn: ({ id, data }) => updateChat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.all,
        exact: false,
      });
    },
  });
};
