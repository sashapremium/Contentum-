// Вкладка Сводка: общие оценки по вариантам

import { CheckIcon, XIcon } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GeneratedText } from '@/features/chat/types/chat.types';
import {
  collectAllBoolKeys,
  collectAllScoreKeys,
  formatScore,
  getActiveMetrics,
  OVERALL_SCORE_KEY,
  scoreColor,
  VARIANT_COLORS,
} from './metricsUtils';

interface MetricsSummaryTabProps {
  items: GeneratedText[];
}

const VARIANT_LABELS = ['Вариант 1', 'Вариант 2', 'Вариант 3'];

export const MetricsSummaryTab = ({ items }: MetricsSummaryTabProps) => {
  const allScoreKeys = collectAllScoreKeys(items);
  const otherScoreKeys = allScoreKeys.filter((k) => k !== OVERALL_SCORE_KEY);
  const allBoolKeys = collectAllBoolKeys(items);

  const overallScores = items.map((item) => {
    const active = getActiveMetrics(item);
    return typeof active[OVERALL_SCORE_KEY] === 'number'
      ? (active[OVERALL_SCORE_KEY] as number)
      : null;
  });

  const chartData = otherScoreKeys.map((key) => {
    const entry: Record<string, string | number> = { metric: key };
    items.forEach((item, i) => {
      const active = getActiveMetrics(item);
      entry[VARIANT_LABELS[i] ?? `Вариант ${i + 1}`] =
        typeof active[key] === 'number' ? (active[key] as number) : 0;
    });
    return entry;
  });

  const hasCountMetrics = items.some((item) => {
    const active = getActiveMetrics(item);
    return Object.values(active).some((v) => typeof v === 'number' && v > 1);
  });

  return (
    <div className="space-y-6">
      {/* Overall score row */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Общая оценка
        </p>
        <div className="grid grid-cols-3 gap-3">
          {items.map((_, idx) => {
            const score = overallScores[idx];
            return (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-lg border p-3"
              >
                <span className="text-xs text-muted-foreground">
                  {VARIANT_LABELS[idx]}
                </span>
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{
                    color: score !== null ? scoreColor(score) : undefined,
                  }}
                >
                  {score !== null ? formatScore(score) : '-'}
                </span>
                {score !== null && (
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${score * 100}%`,
                        backgroundColor: scoreColor(score),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Score metrics bar chart */}
      {otherScoreKeys.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Метрики качества
          </p>
          <ResponsiveContainer
            width="100%"
            height={otherScoreKeys.length * 52 + 40}
          >
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 1]}
                tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="metric"
                width={160}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) =>
                  formatScore(typeof value === 'number' ? value : 0)
                }
              />
              <Legend />
              {items.map((_, idx) => (
                <Bar
                  key={idx}
                  dataKey={VARIANT_LABELS[idx] ?? `Вариант ${idx + 1}`}
                  fill={VARIANT_COLORS[idx] ?? VARIANT_COLORS[0]}
                  barSize={8}
                  radius={[0, 4, 4, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Boolean comparison grid */}
      {allBoolKeys.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Требования
          </p>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                    Критерий
                  </th>
                  {items.map((_, idx) => (
                    <th key={idx} className="px-3 py-2 text-center font-medium">
                      {VARIANT_LABELS[idx]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allBoolKeys.map((key, rowIdx) => (
                  <tr
                    key={key}
                    className={rowIdx % 2 === 1 ? 'bg-muted/20' : undefined}
                  >
                    <td className="px-3 py-2 text-muted-foreground">{key}</td>
                    {items.map((item, idx) => {
                      const active = getActiveMetrics(item);
                      const value = active[key];
                      return (
                        <td key={idx} className="px-3 py-2 text-center">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <CheckIcon
                                className="mx-auto size-4"
                                style={{ color: 'var(--color-success)' }}
                              />
                            ) : (
                              <XIcon
                                className="mx-auto size-4"
                                style={{ color: 'var(--color-error)' }}
                              />
                            )
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Count metrics */}
      {hasCountMetrics && (
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Числовые показатели
          </p>
          <div className="grid grid-cols-3 gap-3">
            {items.map((item, idx) => {
              const active = getActiveMetrics(item);
              const counts = Object.entries(active).filter(
                ([, v]) => typeof v === 'number' && (v as number) > 1,
              ) as [string, number][];
              if (counts.length === 0) return null;
              return (
                <div key={idx} className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {VARIANT_LABELS[idx]}
                  </p>
                  {counts.map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
