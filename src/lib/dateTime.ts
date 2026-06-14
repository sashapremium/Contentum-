// Утилиты для работы с датой и временем.
// LocalDateTime - объект {y, m, d, hh, mm}. parseLocalDateTime парсит строку ISO,
// buildLocalDateTime собирает строку из Date + time-строки, localToDate - обратное.

type LocalDateTime = {
  y: number;
  m: number;
  d: number;
  hh: number;
  mm: number;
};

export const parseLocalDateTime = (v: string): LocalDateTime | null => {
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  return {
    y: Number(m[1]),
    m: Number(m[2]),
    d: Number(m[3]),
    hh: Number(m[4]),
    mm: Number(m[5]),
  };
};

export const formatDate = ({ y, m, d }: Pick<LocalDateTime, 'y' | 'm' | 'd'>) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export const buildLocalDateTime = (date: Date | undefined, time: string) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const [hh, mm] = (time || '00:00').split(':');
  return `${formatDate({ y, m, d })}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

export const localToDate = (v: string) => {
  const p = parseLocalDateTime(v);
  if (!p) return null;
  return new Date(p.y, p.m - 1, p.d, p.hh, p.mm, 0, 0);
};
