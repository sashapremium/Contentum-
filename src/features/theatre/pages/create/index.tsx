// Страница создания учреждения: форма с названием  и адресом
// После успешного создания переходит на страницу учреждений

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

import {
  THEATRE,
  THEATRE_CREATE,
  THEATRE_TITLE,
  THEATRE_CREATE_TITLE,
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

import {
  TheatreCreateRequestSchema,
  type TheatreCreateRequest,
} from '../../types';
import { useCreateTheatreMutation } from '../../queries/useCreateTheatreMutation';

export const TheatreCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateTheatreMutation();

  const form = useForm<TheatreCreateRequest>({
    resolver: zodResolver(TheatreCreateRequestSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  });

  const handleSubmit = (values: TheatreCreateRequest) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate(THEATRE);
      },
    });
  };

  return (
    <PageWrapper
      header={
        <Breadcrumbs
          links={[
            { url: THEATRE, label: THEATRE_TITLE },
            { url: THEATRE_CREATE, label: THEATRE_CREATE_TITLE },
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
                  Создание учреждения
                </span>
                <p className="text-sm text-muted-foreground">
                  Заполните данные нового учреждения
                </p>
              </header>

              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="name"
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите адрес" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {createMutation.isError && (
                <Error description="Не удалось создать учреждение" />
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
