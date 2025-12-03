/* eslint-disable @typescript-eslint/no-explicit-any */
export const CHAT_QUERY_KEYS = {
  all: ['chats'] as const,
  list: (params?: any) => ['chats', { params }] as const,
  detail: (id: string) => ['chats', id] as const,
};
