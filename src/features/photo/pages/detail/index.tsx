import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { BACKEND_URL } from '@/app/router/routes';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageImage } from '@/features/messages/components/Message/MessageImage';

import type { PhotoInputImage, PhotoSession } from '../../types/photos.types';
import { usePhotoSessionQuery } from '../../queries/usePhotoSessionQuery';
import { useUpdatePhotoSessionMutation } from '../../queries/useUpdatePhotoSessionMutation';

// ─── Image input (not RHF-managed — file inputs are uncontrolled) ─────────────

interface PhotoImageInputProps {
  field: PhotoInputImage;
  currentUrl?: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const PhotoImageInput = ({
  field,
  currentUrl,
  selectedFile,
  onFileSelect,
}: PhotoImageInputProps) => {
  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : currentUrl
      ? `${currentUrl}`
      : null;

  return (
    <div className="grid gap-2">
      <Label>{field.label}</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
      />
      {previewUrl && (
        <div className="space-y-1">
          <img
            src={previewUrl}
            alt={field.label}
            className="max-h-[200px] rounded object-cover"
          />
          {!selectedFile && currentUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:underline"
            >
              Текущее изображение
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Inner form — receives session as a guaranteed prop ───────────────────────

const PhotoDetailForm = ({ session }: { session: PhotoSession }) => {
  const updateSessionMutation = useUpdatePhotoSessionMutation();
  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File | null>
  >({});

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodString> = {};
    for (const f of session.inputSchema.texts) {
      shape[f.key] = f.required
        ? z.string().min(1, 'Обязательное поле')
        : z.string();
    }
    return z.object(shape);
  }, [session.inputSchema.texts]);

  const form = useForm<Record<string, string>>({
    resolver: zodResolver(schema),
    defaultValues: session.texts,
  });

  const latestVariant = useMemo(() => {
    if (!session.history.length) return null;
    return [...session.history].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  }, [session.history]);

  const hasHistory = Boolean(session.history.length);

  const allRequiredImagesProvided = session.inputSchema.images
    .filter((f) => f.required)
    .every((f) => selectedFiles[f.key] ?? session.images[f.key]);

  const onSubmit = (texts: Record<string, string>) => {
    const assets = Object.fromEntries(
      Object.entries(selectedFiles).filter(([, f]) => f !== null),
    ) as Record<string, File>;
    const payload =
      Object.keys(assets).length > 0 ? { texts, assets } : { texts };
    updateSessionMutation.mutate({ id: session.sessionId, payload });
  };

  return (
    <PageWrapper wide header={<PageHeading>{session.title}</PageHeading>}>
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">
          Шаблон: {session.templateName} · Учреждение: {session.theatreName}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row">
              <Card className="flex-1">
                <CardContent className="space-y-4">
                  <div className="text-base font-semibold">Тексты</div>
                  {session.inputSchema.texts.map((field) => (
                    <FormField
                      key={field.key}
                      control={form.control}
                      name={field.key}
                      render={({ field: rhfField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...rhfField}
                              placeholder={field.label}
                              maxLength={field.maxLength}
                              rows={1}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="space-y-4">
                  <div className="text-base font-semibold">Фото</div>
                  {session.inputSchema.images.map((field) => (
                    <PhotoImageInput
                      key={field.key}
                      field={field}
                      currentUrl={session.images[field.key]}
                      selectedFile={selectedFiles[field.key] ?? null}
                      onFileSelect={(file) =>
                        setSelectedFiles((prev) => ({
                          ...prev,
                          [field.key]: file,
                        }))
                      }
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={
                  !allRequiredImagesProvided || updateSessionMutation.isPending
                }
              >
                {updateSessionMutation.isPending
                  ? 'Генерация...'
                  : hasHistory
                    ? 'Перегенерировать'
                    : 'Сгенерировать'}
              </Button>
            </div>

            {updateSessionMutation.isError && (
              <Error description="Не удалось выполнить генерацию" />
            )}
          </form>
        </Form>

        {/* Result */}
        <div className="space-y-3">
          <div className="text-lg font-semibold">Результат</div>
          {!latestVariant ? (
            <div className="text-sm text-muted-foreground">
              Пока нет сгенерированных вариантов
            </div>
          ) : (
            <>
              <Card className="max-w-[500px]">
                <CardContent>
                  <MessageImage info={latestVariant} />
                </CardContent>
              </Card>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a
                    href={`${latestVariant.resultPng}`}
                    target="_blank"
                    rel="noreferrer"
                    download="photo_v.png"
                  >
                    Скачать PNG
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={`${latestVariant.resultWebp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Скачать WEBP
                  </a>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* History */}
        <div className="space-y-3">
          <div className="text-lg font-semibold">История вариантов</div>
          {!session.history.length && (
            <div className="text-sm text-muted-foreground">
              История пока пуста
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {session.history
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((item) => (
                <Card
                  className="w-[300px]"
                  key={`${item.variantNumber}-${item.createdAt}`}
                >
                  <CardContent className="space-y-3">
                    <MessageImage info={item} prefix={BACKEND_URL} />
                    <span className="text-sm font-medium">
                      #{item.variantNumber}{' '}
                      {Object.values(item.texts)[0] ?? item.mainText}
                    </span>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// ─── Outer page — handles loading / error ─────────────────────────────────────

export const PhotoDetailPage = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const { data: session, isLoading, isError } = usePhotoSessionQuery(photoId);

  if (!photoId) {
    return (
      <PageWrapper header={<PageHeading>Фото</PageHeading>}>
        <Error description="Session id is missing" />
      </PageWrapper>
    );
  }

  if (isLoading) return <Loading />;

  if (isError || !session) {
    return (
      <PageWrapper header={<PageHeading>Фото</PageHeading>}>
        <Error description="Failed to load session" />
      </PageWrapper>
    );
  }

  return <PhotoDetailForm session={session} />;
};
