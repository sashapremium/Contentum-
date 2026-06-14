// Страница создания фото-сессии: выбор учреждения и шаблона.
// Список шаблонов фильтруется по выбранному учреждению через брендбук.
// При смене учреждения templateId сбрасывается.

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

import { PHOTO, PHOTO_TITLE } from '@/app/router/routes';
import { Loading } from '@/components/shared/Loading';
import { Error } from '@/components/shared/Error';
import { PageHeading } from '@/components/shared/PageHeading';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { usePhotoSessionsQuery } from '../../queries/usePhotoSessionsQuery';
import { useCreatePhotoSessionMutation } from '../../queries/useCreatePhotoSessionMutation';
import { cx } from 'class-variance-authority';

const SessionCreateSchema = z.object({
  theatreId: z.string().min(1, 'Выберите театр'),
  templateId: z.string().min(1, 'Выберите шаблон'),
});

type SessionCreateFormValues = z.infer<typeof SessionCreateSchema>;

export const SessionCreatePage = () => {
  const navigate = useNavigate();

  const sessionsQuery = usePhotoSessionsQuery();
  const createSessionMutation = useCreatePhotoSessionMutation();

  const form = useForm<SessionCreateFormValues>({
    resolver: zodResolver(SessionCreateSchema),
    defaultValues: {
      theatreId: '',
      templateId: '',
    },
  });
  const { watch, setValue, clearErrors, control } = form;

  const selectedTheatreId = watch('theatreId');

  const templateOptions = useMemo(() => {
    if (!selectedTheatreId || !sessionsQuery.data) {
      return [];
    }

    const brandbook = sessionsQuery.data.brandbooks.find(
      (item) => String(item.theatreId) === selectedTheatreId,
    );

    return brandbook?.templates ?? [];
  }, [selectedTheatreId, sessionsQuery.data]);

  const handleTheatreChange = (value: string) => {
    setValue('theatreId', value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue('templateId', '', {
      shouldDirty: true,
      shouldValidate: false,
      shouldTouch: false,
    });

    clearErrors('templateId');
  };

  const handleSubmit = (values: SessionCreateFormValues) => {
    createSessionMutation.mutate(
      {
        theatreId: Number(values.theatreId),
        templateId: values.templateId,
      },
      {
        onSuccess: (response) => {
          navigate(`${PHOTO}/${response.sessionId}`);
        },
      },
    );
  };

  if (sessionsQuery.isLoading) {
    return <Loading />;
  }

  if (sessionsQuery.isError || !sessionsQuery.data) {
    return (
      <PageWrapper header={<PageHeading>{PHOTO_TITLE}</PageHeading>}>
        <Error description="Не удалось загрузить данные для создания сессии" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper header={<PageHeading>{PHOTO_TITLE}</PageHeading>}>
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <header className="space-y-2">
                <span className={cx('text-xl font-semibold')}>
                  Создание новой сессии
                </span>
                <p className="text-sm text-muted-foreground">
                  Выберите театр и шаблон
                </p>
              </header>
              <div className="flex flex-col gap-3">
                <FormField
                  control={control}
                  name="theatreId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Театр*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={handleTheatreChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[100%]">
                            <SelectValue placeholder="Выберите театр" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sessionsQuery.data.theatres.map((theatre) => (
                            <SelectItem
                              key={theatre.id}
                              value={String(theatre.id)}
                            >
                              {theatre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Шаблон*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedTheatreId}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[100%]">
                            <SelectValue placeholder="Выберите шаблон" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templateOptions.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {createSessionMutation.isError && (
                <Error description="Не удалось создать сессию" />
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={createSessionMutation.isPending}
                >
                  Далее
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
