export const EVENT_QUERY_KEYS = {
  all: ['events'] as const,
  byId: (id: string) => [...EVENT_QUERY_KEYS.all, id] as const,
};
