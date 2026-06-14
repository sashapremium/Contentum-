// Query keys для кэша фото-сессий: sessions (список) и sessionDetail (по id).

export const PHOTOS_QUERY_KEYS = {
  all: ['photos'] as const,
  sessions: () => ['photos', 'sessions'] as const,
  sessionDetail: (id: string) => ['photos', 'sessions', id] as const,
};
