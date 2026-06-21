// Запрос перегенерации сообщения
// Возвращает обновлённое состояние чата
import {
  ChatUpdateResponseSchema,
  type ChatId,
  type ChatUpdateResponse,
} from '@/features/chat/types/chat.types';
import { api } from '@/lib/axios';
import type { RegenerateMessageRequest } from '../types/briefs.types';

export async function reegenerateMessage(
  id: ChatId,
  payload: RegenerateMessageRequest,
): Promise<ChatUpdateResponse> {
  const response = await api.patch(`/briefs/${id}/`, payload);
  return ChatUpdateResponseSchema.parse(response.data);
}
