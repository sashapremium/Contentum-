// Список сгенерированных вариантов. На мобильных - Tabs (активна вкладка лучшего варианта),
// на десктопе - grid. Внизу ссылка на страницу подробного анализа метрик.

import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GeneratedTextMessage } from '@/features/chat/types/chat.types';
import { postMetricsUrl } from '@/app/router/routes';
import { GeneratedVariantCard } from '../GeneratedVariantCard';
import { getVariantLabels } from './metricsUtils';

interface MessageGeneratedProps {
  message: GeneratedTextMessage;
}

export const MessageGenerated = ({ message }: MessageGeneratedProps) => {
  const items = message.payload.content ?? [];
  const { chatId } = useParams<{ chatId: string }>();

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
  const canOpenMetrics = chatId != null && message.id != null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">
        Сгенерированные варианты
      </p>

      {/* Mobile: tabs */}
      <div className="sm:hidden">
        <Tabs defaultValue={String(bestIdx >= 0 ? bestIdx : 0)}>
          <TabsList className="w-full mb-4">
            {items.map((_, idx) => (
              <TabsTrigger
                key={idx}
                value={String(idx)}
                className={
                  idx === bestIdx
                    ? 'data-[state=active]:text-green-600 flex items-center gap-1.5'
                    : ''
                }
              >
                Вариант {idx + 1}
                {idx === bestIdx && (
                  <span className="size-1.5 rounded-full bg-green-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {items.map((item, idx) => (
            <TabsContent key={idx} value={String(idx)}>
              <GeneratedVariantCard
                item={item}
                index={idx}
                label={labels[idx]}
                isBest={idx === bestIdx}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Desktop: grid */}
      <div
        className="hidden sm:grid gap-4"
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

      {canOpenMetrics && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link to={postMetricsUrl(chatId, message.id!)}>
              Подробный обзор
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
