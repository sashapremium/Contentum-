export const EVENT_TYPE_OPTIONS = [
  { value: 'concert', label: 'Концерт' },
  { value: 'performance', label: 'Спектакль' },
  { value: 'festival', label: 'Фестиваль' },
  { value: 'show', label: 'Шоу' },
  { value: 'other', label: 'Другое' },
] as const;

export const AGE_LIMIT_OPTIONS = [
  { value: '0+', label: '0+' },
  { value: '6+', label: '6+' },
  { value: '12+', label: '12+' },
  { value: '16+', label: '16+' },
  { value: '18+', label: '18+' },
] as const;
