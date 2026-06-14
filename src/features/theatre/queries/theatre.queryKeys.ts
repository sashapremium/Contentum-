// Query keys для кэша учреждений: list (все) и detail (по id).

export const THEATRE_QUERY_KEYS = {
  all: ['theatres'] as const,
  list: () => ['theatres', 'list'] as const,
  detail: (id: number) => ['theatres', id] as const,
};
