import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Event } from '../types';

interface EventInfoProps {
  event: Event;
}

export const EventInfo = ({ event }: EventInfoProps) => {
  const formattedDate = format(
    new Date(event.datetime),
    'dd MMMM yyyy, HH:mm',
    {
      locale: ru,
    },
  );

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-base">{event.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {event.genre} · {event.eventType} · {event.ageLimit}
        </div>

        <Separator />

        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Дата и время:</span>
            <div className="text-sm">{formattedDate}</div>
          </div>

          <div>
            <span className="text-sm font-medium">Место:</span>
            <div className="text-sm">{event.place}</div>
          </div>
        </div>

        <Separator />

        <div>
          <span className="text-sm font-medium">Описание:</span>
          <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
            {event.description}
          </p>
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground">
          ID события: {event.id}
        </div>
      </CardContent>
    </Card>
  );
};
