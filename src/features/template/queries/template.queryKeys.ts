//  для кэша шаблонов: detail привязан к паре (theatreId, templateId).

export const TEMPLATE_QUERY_KEYS = {
  all: ['templates'] as const,
  detail: (theatreId: number, templateId: string) =>
    ['templates', theatreId, templateId] as const,
};
