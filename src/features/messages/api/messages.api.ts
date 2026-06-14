// Получение сообщений чата (GET /chats/:id/messages/, page_size 100) и отправка нового сообщения (POST /messages/).

import { api } from '@/lib/axios';
import {
  type Messages,
  GetMessagesResponseSchema,
  type SendMessageBody,
  type SendMessageResponse,
  SendMessageBodySchema,
  SendMessageResponseSchema,
} from '../types/messages.types';

export async function fetchMessages(chatId: string): Promise<Messages> {
  const res = await api.get(`/chats/${chatId}/messages/`, {
    params: { page_size: 100 },
  });

  const parsed = GetMessagesResponseSchema.parse(res.data);
  return parsed.results;
}

export async function sendMessage(
  body: SendMessageBody
): Promise<SendMessageResponse> {
  const validated = SendMessageBodySchema.parse(body);

  const res = await api.post('/messages/', validated);

  return SendMessageResponseSchema.parse(res.data);
}
