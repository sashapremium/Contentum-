// Query keys для кэша брендбуков. detail привязан к id учреждения.
export const BRANDBOOK_QUERY_KEYS = {
  all: ['brandbooks'] as const,
  detail: (theatreId: number) => ['brandbooks', theatreId] as const,
};
