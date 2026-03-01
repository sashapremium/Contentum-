import { api } from '@/lib/axios';
import {
  type Chat,
  type ChatCreateRequest,
  type ChatCreateResponse,
  ChatCreateResponseSchema,
  type ChatListQueryParams,
  type ChatListResponse,
  ChatListResponseSchema,
  ChatSchema,
  type ChatUpdateRequest,
} from '../types/chat.types';

export async function fetchChats(
  params?: ChatListQueryParams,
): Promise<ChatListResponse> {
  const response = await api.get('/chats', {
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
  const response = await api.get(`/chats/${id}`);
  return ChatSchema.parse(response.data);
}

export async function createChat(
  payload: ChatCreateRequest,
): Promise<ChatCreateResponse> {
  const response = await api.post('/chats', payload);
  return ChatCreateResponseSchema.parse(response.data);
}

export async function updateChat(
  id: string,
  payload: ChatUpdateRequest,
): Promise<Chat> {
  const response = await api.patch(`/chats/${id}`, payload);
  return ChatSchema.parse(response.data);
}

export async function deleteChat(id: string): Promise<void> {
  await api.delete(`/chats/${id}`);
}
