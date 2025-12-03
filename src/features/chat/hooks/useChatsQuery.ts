import { useQuery } from '@tanstack/react-query';
import { fetchChats } from '../api/chat.api';
import type {
  ChatListQueryParams,
  ChatListResponse,
} from '../types/chat.types';
import { CHAT_QUERY_KEYS } from '@/features/chat/hooks/queryKeys';
import { useError } from '@/hooks/useToast';

export const useChatsQuery = (params?: ChatListQueryParams) => {
  const e = useError();
  return useQuery<ChatListResponse>({
    queryKey: CHAT_QUERY_KEYS.list(params),
    queryFn: () => fetchChats(params),
    throwOnError(error) {
      console.log('error', error);
      e('Ошибка при загрузке чатов');
      return false;
    },
  });
};
