import { useEffect } from 'react';
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
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTimePicker } from '@/features/forms/components/DateTimePicker';

import { EventCreateRequestSchema, type EventCreateRequest } from '../../types';
import { useEventQuery } from '../../queries/useEventQuery';
import { useUpdateEventMutation } from '../../queries/useUpdateEventMutation';
import { AGE_LIMIT_OPTIONS, EVENT_TYPE_OPTIONS } from '../../constants';

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
      : {
          title: '',
          eventType: '',
          datetime: '',
          description: '',
          ageLimit: '',
          genre: '',
          place: '',
        },
  });

  console.log('Form values', form.getValues());
  useEffect(() => {
    const { unsubscribe } = form.watch(() => {
      form.clearErrors();
      updateMutation.reset();
    });
    return unsubscribe;
  }, [form, updateMutation]);

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

  return (
    <PageWrapper
      header={
        <Breadcrumbs
          links={[
            { onClick: () => navigate(-1), label: THEATRE_TITLE },
            { url: '#', label: event.title },
          ]}
        />
      }
    >
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
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>Название*</FieldLabel>
                      <FormControl>
                        <Input placeholder="Введите название" {...field} />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>Описание</FieldLabel>
                      <FormControl>
                        <Input placeholder="Введите описание" {...field} />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field, fieldState }) => {
                    console.log('eventType', field);
                    return (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>Тип события</FieldLabel>
                        <FormControl>
                          <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Выберите тип">
                                {
                                  EVENT_TYPE_OPTIONS.find(
                                    (o) => o.value === field.value,
                                  )?.label
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </Field>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="ageLimit"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>Возрастное ограничение</FieldLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите ограничение">
                              {
                                AGE_LIMIT_OPTIONS.find(
                                  (o) => o.value === field.value,
                                )?.label
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {AGE_LIMIT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>Жанр</FieldLabel>
                      <FormControl>
                        <Input placeholder="Введите жанр" {...field} />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="datetime"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>Дата и время</FieldLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  )}
                />

                <FormField
                  control={form.control}
                  name="place"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>Место</FieldLabel>
                      <FormControl>
                        <Input placeholder="Введите место" {...field} />
                      </FormControl>
                      <FormMessage />
                    </Field>
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
