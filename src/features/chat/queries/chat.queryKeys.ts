/* eslint-disable @typescript-eslint/no-explicit-any */
// Query keys для кэша чатов: all, list (с params), detail (по id чата).
export const CHAT_QUERY_KEYS = {
  all: ['chats'] as const,
  list: (params?: any) => ['chats', { params }] as const,
  detail: (id: string) => ['chats', id] as const,
};
