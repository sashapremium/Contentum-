import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

import {
  THEATRE,
  EVENT_CREATE_TITLE,
  THEATRE_TITLE,
} from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
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
import { useCreateEventMutation } from '../../queries/useCreateEventMutation';
import { AGE_LIMIT_OPTIONS, EVENT_TYPE_OPTIONS } from '../../constants';

export const EventCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateEventMutation();

  const form = useForm<EventCreateRequest>({
    resolver: zodResolver(EventCreateRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      eventType: '',
      ageLimit: '',
      genre: '',
      datetime: '',
      place: '',
    },
  });

  const handleSubmit = (values: EventCreateRequest) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ pathname: THEATRE, hash: 'events' }),
    });
  };

  return (
    <PageWrapper
      header={
        <Breadcrumbs
          links={[
            { onClick: () => navigate(-1), label: THEATRE_TITLE },
            { url: '#', label: EVENT_CREATE_TITLE },
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
                <span className="text-xl font-semibold">Создание события</span>
                <p className="text-sm text-muted-foreground">
                  Заполните данные нового события
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
                  render={({ field, fieldState }) => (
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
                  )}
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
                          mustBeFuture
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

              <div className="flex justify-end">
                <Button type="submit" disabled={createMutation.isPending}>
                  Создать
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
