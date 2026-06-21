// Вкладка мероприятий на странице учреждений
import { useState } from 'react';
import { generatePath, Link, useNavigate } from 'react-router';
import { FilePlus, Settings2, Trash2 } from 'lucide-react';

import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { Event } from '../types';
import { useEventsQuery } from '../queries/useEventsQuery';
import { useDeleteEventMutation } from '../queries/useDeleteEventMutation';
import { EVENT_TYPE_OPTIONS } from '../constants';
import {
  THEATRE_EVENT_CREATE,
  THEATRE_EVENT_DETAIL,
} from '@/app/router/routes';

export const EventsTab = () => {
  const navigate = useNavigate();
  const eventsQuery = useEventsQuery();
  const deleteMutation = useDeleteEventMutation();

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  if (eventsQuery.isLoading) return <Loading />;
  if (eventsQuery.isError)
    return <Error description="Не удалось загрузить мероприятия" />;

  const events = eventsQuery.data?.events ?? [];

  return (
    <div className="space-y-4">
      <div>
        <Button asChild>
          <Link to={THEATRE_EVENT_CREATE}>
            <FilePlus />
            Создать мероприятие
          </Link>
        </Button>
      </div>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">Мероприятия не найдены</p>
      )}

      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div>
              <div className="font-medium">{event.title}</div>
              {(event.eventType || event.datetime) && (
                <div className="text-sm text-muted-foreground">
                  {[
                    EVENT_TYPE_OPTIONS.find((o) => o.value === event.eventType)
                      ?.label,
                    event.datetime &&
                      new Date(event.datetime).toLocaleString('ru-RU'),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate(
                        generatePath(THEATRE_EVENT_DETAIL, {
                          eventId: String(event.id),
                        }),
                      )
                    }
                  >
                    <Settings2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Изменить</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(event)}
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Удалить</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить мероприятие?"
        description={`Мероприятие «${deleteTarget?.title}» будет удалено безвозвратно.`}
        confirmText="Удалить"
        onClickConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
};
