import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../api/messages.api';
import { MESSAGES_QUERY_KEYS } from './messages.queryKeys';
import type { Messages } from '../types/messages.types';

export const useMessagesQuery = (chatId: string | undefined) => {
  return useQuery<Messages>({
    queryKey: MESSAGES_QUERY_KEYS.list(chatId!),
    queryFn: () => fetchMessages(chatId!),
    enabled: typeof chatId === 'string' && chatId.length > 0,
  });
};
