// Карточка одного варианта для вкладки по вариантам,общая оценка с прогресс-баром
// и список остальных score-метрик с прогресс-барами

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GeneratedText } from '@/features/chat/types/chat.types';
import {
  categorizeMetrics,
  formatScore,
  getActiveMetrics,
  OVERALL_SCORE_KEY,
  scoreColor,
  VARIANT_COLORS,
} from './metricsUtils';

interface MetricsVariantCardProps {
  item: GeneratedText;
  index: number;
}

export const MetricsVariantCard = ({
  item,
  index,
}: MetricsVariantCardProps) => {
  const active = getActiveMetrics(item);
  const { score } = categorizeMetrics(active);
  const overall = score.find((s) => s.key === OVERALL_SCORE_KEY);
  const otherScores = score.filter((s) => s.key !== OVERALL_SCORE_KEY);
  const variantColor = VARIANT_COLORS[index] ?? VARIANT_COLORS[0];

  return (
    <Card className="gap-3">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Вариант {index + 1}</CardTitle>
          {overall && (
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color: scoreColor(overall.value) }}
            >
              {formatScore(overall.value)}
            </span>
          )}
        </div>
        {overall && (
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${overall.value * 100}%`,
                backgroundColor: scoreColor(overall.value),
              }}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {otherScores.length > 0 && (
          <div className="space-y-2">
            {otherScores.map(({ key, value }) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{key}</span>
                  <span
                    className="font-medium tabular-nums"
                    style={{ color: scoreColor(value) }}
                  >
                    {formatScore(value)}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${value * 100}%`,
                      backgroundColor: variantColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* {bool.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {bool.map(({ key, value }) => (
              <div key={key} className="flex items-center gap-1.5 text-xs">
                {value ? (
                  <CheckIcon
                    className="size-3.5 shrink-0"
                    style={{ color: 'var(--color-success)' }}
                  />
                ) : (
                  <XIcon
                    className="size-3.5 shrink-0"
                    style={{ color: 'var(--color-error)' }}
                  />
                )}
                <span className="text-muted-foreground truncate">{key}</span>
              </div>
            ))}
          </div>
        )} */}

        {/* {count.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {count.map(({ key, value }) => (
              <div key={key} className="rounded-md border px-2 py-1 text-xs">
                <span className="text-muted-foreground">{key}: </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};
