import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GeneratedTextMessage } from '@/features/chat/types/chat.types';

interface MessageGeneratedProps {
  message: GeneratedTextMessage;
}

function stripMetricPrefix(value: string): string {
  const index = value.indexOf('|');

  if (index === -1) return value;

  return value.slice(index + 1);
}

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
                  <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {metricsEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col items-start gap-1"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {key}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stripMetricPrefix(value)}
                        </div>
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
