import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChat } from '../api/chat.api';
import type {
  ChatCreateRequest,
  ChatCreateResponse,
} from '../types/chat.types';
import { CHAT_QUERY_KEYS } from './queryKeys';

export const useCreateChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatCreateResponse, unknown, ChatCreateRequest>({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.all,
        exact: false,
      });
    },
  });
};
