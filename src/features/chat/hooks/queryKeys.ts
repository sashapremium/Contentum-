export const CHAT_QUERY_KEYS = {
  all: ['chats'] as const,
  detail: (id: string) => ['chats', id] as const,
};
