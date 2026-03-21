import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { PageHeading } from '@/components/shared/PageHeading';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Error } from '@/components/shared/Error';
import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { usePhotoSessionQuery } from '../../queries/usePhotoSessionQuery';
import { useUploadPhotoSessionSourceImageMutation } from '../../queries/useUploadPhotoSessionSourceImageMutation';
import { useUpdatePhotoSessionMutation } from '../../queries/useUpdatePhotoSessionMutation';
import { Input } from '@/components/ui/input';
import { MessageImage } from '@/features/messages/components/Message/MessageImage';
import { BACKEND_URL } from '@/app/router/routes';

export const PhotoDetailPage = () => {
  const { photoId } = useParams<{ photoId: string }>();

  const { data: session, isLoading, isError } = usePhotoSessionQuery(photoId);
  const uploadImageMutation = useUploadPhotoSessionSourceImageMutation();
  const updateSessionMutation = useUpdatePhotoSessionMutation();

  const [mainText, setMainText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadedSourceImageUrl, setUploadedSourceImageUrl] = useState<
    string | null
  >(null);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const latestVariant = useMemo(() => {
    if (!session?.history.length) {
      return null;
    }

    return [...session.history].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  }, [session?.history]);

  const hasHistory = Boolean(session?.history.length);
  const hasSourceImage = Boolean(
    uploadedSourceImageUrl || latestVariant?.sourceImageUrl,
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !photoId) {
      return;
    }

    setSelectedFileName(file.name);

    uploadImageMutation.mutate(
      {
        id: photoId,
        file,
      },
      {
        onSuccess: (response) => {
          setUploadedSourceImageUrl(response.url);
        },
      },
    );
  };

  const handleGenerate = () => {
    if (!photoId || !mainText.trim()) {
      return;
    }

    updateSessionMutation.mutate({
      id: photoId,
      payload: {
        mainText: mainText.trim(),
        sourceImageUrl: uploadedSourceImageUrl ?? undefined,
      },
    });
  };

  const handleRegenerate = () => {
    if (!photoId || !mainText.trim()) {
      return;
    }

    updateSessionMutation.mutate({
      id: photoId,
      payload: {
        mainText: mainText.trim(),
      },
    });
  };

  if (!photoId) {
    return (
      <PageWrapper header={<PageHeading>Фото</PageHeading>}>
        <Error description="Session id is missing" />
      </PageWrapper>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !session) {
    return (
      <PageWrapper header={<PageHeading>Фото</PageHeading>}>
        <Error description="Failed to load session" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper wide header={<PageHeading>{session.title}</PageHeading>}>
      <div className="space-y-8">
        <div className="flex gap-3">
          <div className="space-y-3 min-w-[100%] lg:min-w-[50%]">
            <div className="text-lg font-semibold">Исходная фотография</div>

            {/* {(uploadedSourceImageUrl !== null ||
            latestVariant?.sourceImageUrl !== undefined) && (
            <MessageImage info={{}} />
          )} */}

            <Input
              id="source-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploadImageMutation.isPending}
            />

            {uploadImageMutation.isError && (
              <Error description="Не удалось загрузить изображение" />
            )}

            <Textarea
              id="main-text"
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="Введите текст для генерации"
              rows={4}
            />

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGenerate}
                disabled={
                  updateSessionMutation.isPending ||
                  !mainText.trim() ||
                  !hasSourceImage
                }
              >
                {updateSessionMutation.isPending
                  ? 'Генерация...'
                  : 'Сгенерировать'}
              </Button>

              <Button
                variant="secondary"
                onClick={handleRegenerate}
                disabled={
                  updateSessionMutation.isPending ||
                  !mainText.trim() ||
                  !hasHistory
                }
              >
                Перегенерировать
              </Button>
            </div>

            {updateSessionMutation.isError && (
              <Error description="Не удалось выполнить генерацию" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-lg font-semibold">Результат</div>

          {!latestVariant && (
            <div className="text-sm text-muted-foreground">
              Пока нет сгенерированных вариантов
            </div>
          )}

          {latestVariant && (
            <Card>
              <CardContent className="space-y-4">
                <MessageImage info={latestVariant} prefix={BACKEND_URL} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-lg font-semibold">История вариантов</div>

          {!session.history.length && (
            <div className="text-sm text-muted-foreground">
              История пока пуста
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {session.history
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((item) => (
                <Card key={`${item.variantNumber}-${item.createdAt}`}>
                  <CardContent className="space-y-3 pt-6">
                    <MessageImage info={item} prefix={BACKEND_URL} />

                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        #{item.variantNumber} {item.mainText}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.createdAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
