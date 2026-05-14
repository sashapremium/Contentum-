import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

import {
  THEATRE,
  EVENT_CREATE_TITLE,
  THEATRE_TITLE,
} from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Error } from '@/components/shared/Error';
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
import { useCreateEventMutation } from '../../queries/useCreateEventMutation';

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

              {createMutation.isError && (
                <Error description="Не удалось создать событие" />
              )}

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
