import type { GeneratedText } from '@/features/chat/types/chat.types';

export const OVERALL_SCORE_KEY = 'Общая оценка';

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
  if (value >= 0.7) return 'var(--color-success)';
  if (value >= 0.4) return 'var(--color-chart-4)';
  return 'var(--color-error)';
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

export function collectAllScoreKeys(
  items: GeneratedText[],
): string[] {
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
