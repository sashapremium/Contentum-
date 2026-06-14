// CRUD-запросы для чатов: список (с фильтрацией), детали, создание, переименование, обновление (шаг формы или генерация), удаление.
import { api } from '@/lib/axios';
import {
  type ChatCreateRequest,
  type ChatCreateResponse,
  ChatCreateResponseSchema,
  type ChatListQueryParams,
  type ChatListResponse,
  ChatListResponseSchema,
  type ChatRenameRequest,
  ChatSchema,
  type ChatUpdateRequest,
  type ChatUpdateResponse,
  ChatUpdateResponseSchema,
} from '../types/chat.types';

export async function fetchChats(
  params?: ChatListQueryParams,
): Promise<ChatListResponse> {
  const response = await api.get('/chats/', {
    params: {
      search: params?.search,
      ordering: params?.ordering,
      page: params?.page,
      page_size: params?.pageSize,
    },
  });

  return ChatListResponseSchema.parse(response.data);
}

export async function fetchChat(id: string) {
  const response = await api.get(`/chats/${id}/`);
  return ChatSchema.parse(response.data);
}

export async function createChat(
  payload: ChatCreateRequest,
): Promise<ChatCreateResponse> {
  const response = await api.post('/chats/', payload);
  return ChatCreateResponseSchema.parse(response.data);
}

export async function renameChat(id: string, payload: ChatRenameRequest) {
  await api.patch(`/chats/${id}/`, payload);
}

export async function updateChat(
  id: string,
  payload: ChatUpdateRequest,
): Promise<ChatUpdateResponse> {
  const response = await api.patch(`/chats/${id}/`, payload);
  return ChatUpdateResponseSchema.parse(response.data);
}

export async function deleteChat(id: string): Promise<void> {
  await api.delete(`/chats/${id}/`);
}
