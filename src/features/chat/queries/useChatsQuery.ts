// Query для получения списка чатов. Поддерживает фильтрацию (search, ordering, page).
import { useQuery } from '@tanstack/react-query';
import { fetchChats } from '../api/chat.api';
import type {
  ChatListQueryParams,
  ChatListResponse,
} from '../types/chat.types';
import { CHAT_QUERY_KEYS } from './chat.queryKeys';

export const useChatsQuery = (params?: ChatListQueryParams) => {
  return useQuery<ChatListResponse>({
    queryKey: CHAT_QUERY_KEYS.list(params),
    queryFn: () => fetchChats(params),
  });
};
