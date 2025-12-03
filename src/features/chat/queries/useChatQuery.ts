import { useQuery } from '@tanstack/react-query';
import { fetchChat } from '../api/chat.api';
import { CHAT_QUERY_KEYS } from './queryKeys';
import type { Chat } from '../types/chat.types';

export const useChatQuery = (id: string | undefined) => {
  return useQuery<Chat>({
    queryKey: CHAT_QUERY_KEYS.detail(id!),
    queryFn: () => fetchChat(id!),
    enabled: Boolean(id),
  });
};
