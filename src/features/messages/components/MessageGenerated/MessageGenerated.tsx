import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GeneratedTextMessage } from '@/features/chat/types/chat.types';
import { GeneratedVariantCard } from '../GeneratedVariantCard';
import { MetricsCompareDialog } from './MetricsCompareDialog';
import { getVariantLabels } from './metricsUtils';

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

  const labels = getVariantLabels(items);
  const bestIdx = labels.indexOf('Лучший вариант');

  return (
    <div className="space-y-4">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map((item, idx) => (
          <GeneratedVariantCard
            key={idx}
            item={item}
            index={idx}
            label={labels[idx]}
            isBest={idx === bestIdx}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Подробный обзор
        </Button>
        <MetricsCompareDialog
          open={open}
          onOpenChange={setOpen}
          items={items}
        />
      </div>
    </div>
  );
};
