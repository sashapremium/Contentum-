import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GeneratedTextMessage } from '@/features/chat/types/chat.types';
import { MetricsCompareDialog } from './MetricsCompareDialog';
import { formatMetricValue } from './metricsUtils';

interface MessageGeneratedProps {
  message: GeneratedTextMessage;
}

export const MessageGenerated = ({ message }: MessageGeneratedProps) => {
  const items = message.payload.content ?? [];
  const [open, setOpen] = useState(false);

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
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Сравнить метрики
        </Button>
        <MetricsCompareDialog
          open={open}
          onOpenChange={setOpen}
          items={items}
        />
      </div>

      {items.map((item, idx) => {
        const metricsEntries = Object.entries(item.metrics ?? {}).filter(
          ([, v]) => v !== 'disabled',
        ) as [string, number | boolean][];
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
