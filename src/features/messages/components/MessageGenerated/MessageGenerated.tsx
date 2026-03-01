import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GeneratedTextMessage } from '@/features/chat/types/chat.types';

interface MessageGeneratedProps {
  message: GeneratedTextMessage;
}

const METRIC_LABELS: Record<string, string> = {
  // Fill when metric keys stabilize:
  // relevance: 'Релевантность',
  // uniqueness: 'Уникальность',
};

const formatMetricValue = (value: unknown): string => {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number')
    return Number.isFinite(value) ? String(value) : '—';
  if (typeof value === 'boolean') return value ? 'true' : 'false';

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const MessageGenerated = ({ message }: MessageGeneratedProps) => {
  const items = message.payload.content ?? [];

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Сгенерированные варианты</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Нет сгенерированных вариантов.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const metricsEntries = Object.entries(item.metrics ?? {});
        const title = `Вариант ${idx + 1}`;

        return (
          <Card key={idx} className="gap-2">
            <CardHeader>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {item.text}
              </div>

              <div className="border-t pt-3">
                {metricsEntries.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Метрики отсутствуют
                  </div>
                ) : (
                  <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                    {metricsEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start justify-between gap-3"
                      >
                        <dt className="text-sm font-medium text-foreground">
                          {METRIC_LABELS[key] ?? key}
                        </dt>
                        <dd className="text-sm text-muted-foreground text-right break-all">
                          {formatMetricValue(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
