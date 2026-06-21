// для кэша мероприятий
export const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  list: () => ['events', 'list'] as const,
  detail: (id: string) => ['events', id] as const,
};
