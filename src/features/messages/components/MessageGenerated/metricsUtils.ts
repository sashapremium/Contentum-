// Утилиты для работы с метриками сгенерированного текста

import type { GeneratedText } from '@/features/chat/types/chat.types';

export const OVERALL_SCORE_KEY = 'Общая оценка';
export const DISTINCT_KEY = 'Лексическое разнообразие';
export const IFEVAL_KEY = 'Следование требованиям';
export const TONE_MATCH_KEY = 'Соответствие тональности';
export const AUDIENCE_MATCH_KEY = 'Соответствие целевой аудитории';
export const SUMMAC_KEY = 'Согласованность с брифом';
export const MAUVE_KEY = 'Похожесть на референсы';
export const LENGTH_KEY = 'Длина текста';

export const VARIANT_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
] as const;

export interface ScoreMetric {
  key: string;
  value: number;
}

export interface CountMetric {
  key: string;
  value: number;
}

export interface BoolMetric {
  key: string;
  value: boolean;
}

export interface CategorizedMetrics {
  score: ScoreMetric[];
  count: CountMetric[];
  bool: BoolMetric[];
}

export interface DashboardMetrics {
  ifeval: number;
  distinct: number;
  toneMatch: number;
  audienceMatch: number;
  sumac: number;
  mauve: number;
}

export function categorizeMetrics(
  metrics: Record<string, number | boolean>,
): CategorizedMetrics {
  const score: ScoreMetric[] = [];
  const count: CountMetric[] = [];
  const bool: BoolMetric[] = [];

  for (const [key, value] of Object.entries(metrics)) {
    if (typeof value === 'boolean') {
      bool.push({ key, value });
    } else if (value >= 0 && value <= 1) {
      score.push({ key, value });
    } else {
      count.push({ key, value });
    }
  }

  return { score, count, bool };
}

export function formatScore(value: number): string {
  return (value * 100).toFixed(1) + '%';
}

export function scoreColor(value: number): string {
  if (value >= 0.7) return 'var(--color-green-500)';
  if (value >= 0.4) return 'var(--color-amber-500)';
  return 'var(--color-red-500)';
}

export function formatMetricValue(value: number | boolean): string {
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
  return String(value);
}

export function getActiveMetrics(
  item: GeneratedText,
): Record<string, number | boolean> {
  return Object.fromEntries(
    Object.entries(item.metrics).filter(([, v]) => v !== 'disabled'),
  ) as Record<string, number | boolean>;
}

export function getMetricScore(item: GeneratedText, key: string): number {
  const active = getActiveMetrics(item);
  const value = active[key];
  return typeof value === 'number' && value >= 0 && value <= 1 ? value : 0;
}

export function getMetricCount(
  item: GeneratedText,
  key: string,
): number | null {
  const active = getActiveMetrics(item);
  const value = active[key];
  return typeof value === 'number' && value > 1 ? value : null;
}

export function getDashboardMetrics(item: GeneratedText): DashboardMetrics {
  return {
    ifeval: getMetricScore(item, IFEVAL_KEY),
    distinct: getMetricScore(item, DISTINCT_KEY),
    toneMatch: getMetricScore(item, TONE_MATCH_KEY),
    audienceMatch: getMetricScore(item, AUDIENCE_MATCH_KEY),
    sumac: getMetricScore(item, SUMMAC_KEY),
    mauve: getMetricScore(item, MAUVE_KEY),
  };
}

export function collectAllScoreKeys(items: GeneratedText[]): string[] {
  const keys = new Set<string>();
  for (const item of items) {
    const active = getActiveMetrics(item);
    for (const [key, value] of Object.entries(active)) {
      if (typeof value === 'number' && value >= 0 && value <= 1) {
        keys.add(key);
      }
    }
  }
  return Array.from(keys);
}

export function collectAllBoolKeys(items: GeneratedText[]): string[] {
  const keys = new Set<string>();
  for (const item of items) {
    const active = getActiveMetrics(item);
    for (const [key, value] of Object.entries(active)) {
      if (typeof value === 'boolean') keys.add(key);
    }
  }
  return Array.from(keys);
}

export type VariantQualityLabel = 'Слабый' | 'Средний' | 'Лучший вариант';

export function getVariantLabels(
  items: GeneratedText[],
): VariantQualityLabel[] {
  const scores = items.map((item, idx) => {
    const v = item.metrics[OVERALL_SCORE_KEY];
    return { idx, score: typeof v === 'number' ? v : 0 };
  });

  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const labels: VariantQualityLabel[] = new Array(items.length).fill('Средний');

  sorted.forEach(({ idx }, rank) => {
    if (rank === 0) labels[idx] = 'Лучший вариант';
    else if (rank === sorted.length - 1 && sorted.length > 1)
      labels[idx] = 'Слабый';
  });

  return labels;
}
