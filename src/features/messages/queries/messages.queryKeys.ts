//  для кэша сообщений list привязан к id чата.

export const MESSAGES_QUERY_KEYS = {
  all: ['messages'] as const,
  list: (chatId: string) => ['messages', chatId] as const,
};
