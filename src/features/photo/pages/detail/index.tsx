import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { BACKEND_URL } from '@/app/router/routes';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageImage } from '@/features/messages/components/Message/MessageImage';

import type {
  PhotoInputImage,
  PhotoInputText,
  PhotoSession,
} from '../../types/photos.types';
import { usePhotoSessionQuery } from '../../queries/usePhotoSessionQuery';
import { useUpdatePhotoSessionMutation } from '../../queries/useUpdatePhotoSessionMutation';

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PhotoTextInputProps {
  field: PhotoInputText;
  value: string;
  onChange: (value: string) => void;
}

const PhotoTextInput = ({ field, value, onChange }: PhotoTextInputProps) => (
  <div className="space-y-2 rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{field.label}</span>
      {field.required && (
        <span className="text-xs font-semibold uppercase text-yellow-500">
          Required
        </span>
      )}
    </div>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.label}
      maxLength={field.maxLength}
      className="min-h-[100px] resize-none"
    />
  </div>
);

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
      ? `${BACKEND_URL}${currentUrl}`
      : null;

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{field.label}</span>
        {field.required && (
          <span className="text-xs font-semibold uppercase text-yellow-500">
            Required
          </span>
        )}
      </div>
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

  const [texts, setTexts] = useState<Record<string, string>>(session.texts);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  const latestVariant = useMemo(() => {
    if (!session.history.length) return null;
    return [...session.history].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  }, [session.history]);

  const hasHistory = Boolean(session.history.length);

  const canGenerate =
    session.inputSchema.texts.filter((f) => f.required).every((f) => texts[f.key]?.trim()) &&
    session.inputSchema.images.filter((f) => f.required).every((f) => selectedFiles[f.key] ?? session.images[f.key]);

  const buildPayload = () => {
    const assets = Object.fromEntries(
      Object.entries(selectedFiles).filter(([, f]) => f !== null),
    ) as Record<string, File>;
    return Object.keys(assets).length > 0 ? { texts, assets } : { texts };
  };

  const handleGenerate = () =>
    updateSessionMutation.mutate({ id: session.sessionId, payload: buildPayload() });

  const handleRegenerate = () =>
    updateSessionMutation.mutate({ id: session.sessionId, payload: buildPayload() });

  return (
    <PageWrapper wide header={<PageHeading>{session.title}</PageHeading>}>
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">
          Шаблон: {session.templateName} · theatreId: {session.theatreId}
        </p>

        {/* Form */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <Card className="flex-1">
            <CardContent className="space-y-3">
              <span className="text-base font-semibold text-yellow-500">Тексты</span>
              {session.inputSchema.texts.map((field) => (
                <PhotoTextInput
                  key={field.key}
                  field={field}
                  value={texts[field.key] ?? ''}
                  onChange={(value) =>
                    setTexts((prev) => ({ ...prev, [field.key]: value }))
                  }
                />
              ))}
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="space-y-3">
              <span className="text-base font-semibold text-yellow-500">Фото</span>
              {session.inputSchema.images.map((field) => (
                <PhotoImageInput
                  key={field.key}
                  field={field}
                  currentUrl={session.images[field.key]}
                  selectedFile={selectedFiles[field.key] ?? null}
                  onFileSelect={(file) =>
                    setSelectedFiles((prev) => ({ ...prev, [field.key]: file }))
                  }
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || updateSessionMutation.isPending}
          >
            {updateSessionMutation.isPending ? 'Генерация...' : 'Сгенерировать'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleRegenerate}
            disabled={!canGenerate || !hasHistory || updateSessionMutation.isPending}
          >
            Перегенерировать
          </Button>
        </div>

        {updateSessionMutation.isError && (
          <Error description="Не удалось выполнить генерацию" />
        )}

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
                  <MessageImage info={latestVariant} prefix={BACKEND_URL} />
                </CardContent>
              </Card>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a
                    href={`${BACKEND_URL}${latestVariant.resultPng}`}
                    target="_blank"
                    rel="noreferrer"
                    download="photo_v.png"
                  >
                    Скачать PNG
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={`${BACKEND_URL}${latestVariant.resultWebp}`}
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
            <div className="text-sm text-muted-foreground">История пока пуста</div>
          )}
          <div className="flex flex-wrap gap-3">
            {session.history
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
