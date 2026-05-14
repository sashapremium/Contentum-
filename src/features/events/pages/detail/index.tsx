import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';

import { THEATRE, THEATRE_TITLE } from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { EventCreateRequestSchema, type EventCreateRequest } from '../../types';
import { useEventQuery } from '../../queries/useEventQuery';
import { useUpdateEventMutation } from '../../queries/useUpdateEventMutation';

export const EventDetailPage = () => {
  const { eventId = '' } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const eventQuery = useEventQuery(eventId);
  const updateMutation = useUpdateEventMutation();

  const form = useForm<EventCreateRequest>({
    resolver: zodResolver(EventCreateRequestSchema),
    values: eventQuery.data
      ? {
          title: eventQuery.data.title,
          description: eventQuery.data.description,
          eventType: eventQuery.data.eventType,
          ageLimit: eventQuery.data.ageLimit,
          genre: eventQuery.data.genre,
          datetime: eventQuery.data.datetime,
          place: eventQuery.data.place,
        }
      : { title: '' },
  });

  const handleSubmit = (payload: EventCreateRequest) => {
    updateMutation.mutate(
      { id: Number(eventId), payload },
      { onSuccess: () => navigate({ pathname: THEATRE, hash: 'events' }) },
    );
  };

  if (eventQuery.isLoading) return <Loading />;
  if (eventQuery.isError)
    return <Error description="Не удалось загрузить событие" />;

  const event = eventQuery.data!;

  const breadcrumbs = [
    { onClick: () => navigate(-1), label: THEATRE_TITLE },
    { url: '#', label: event.title },
  ];

  return (
    <PageWrapper header={<Breadcrumbs links={breadcrumbs} />}>
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <header className="space-y-2">
                <span className="text-xl font-semibold">
                  Редактирование события
                </span>
                <p className="text-sm text-muted-foreground">
                  Измените данные события
                </p>
              </header>

              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название*</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите название" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите описание" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип события</FormLabel>
                      <FormControl>
                        <Input placeholder="concert, festival…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Возрастное ограничение</FormLabel>
                      <FormControl>
                        <Input placeholder="0+, 6+, 12+…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Жанр</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите жанр" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дата и время</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Место</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите место" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {updateMutation.isError && (
                <Error description="Не удалось обновить событие" />
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  Сохранить
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
