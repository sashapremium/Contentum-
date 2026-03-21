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

export const PhotoDetailPage = () => {
  const { photoId } = useParams<{ photoId: string }>();

  const sessionQuery = usePhotoSessionQuery(photoId);
  const uploadImageMutation = useUploadPhotoSessionSourceImageMutation();
  const updateSessionMutation = useUpdatePhotoSessionMutation();

  const [mainText, setMainText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadedSourceImageUrl, setUploadedSourceImageUrl] = useState<
    string | null
  >(null);

  const latestVariant = useMemo(() => {
    if (!sessionQuery.data?.history.length) {
      return null;
    }

    return [...sessionQuery.data.history].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  }, [sessionQuery.data?.history]);

  const hasHistory = Boolean(sessionQuery.data?.history.length);
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
          setUploadedSourceImageUrl(response.sourceImageUrl);
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

  if (sessionQuery.isLoading) {
    return <Loading />;
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <PageWrapper header={<PageHeading>Фото</PageHeading>}>
        <Error description="Failed to load session" />
      </PageWrapper>
    );
  }

  const session = sessionQuery.data;

  return (
    <PageWrapper wide header={<PageHeading>{session.title}</PageHeading>}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-sm font-medium">Исходная фотография</div>

                {(uploadedSourceImageUrl || latestVariant?.sourceImageUrl) && (
                  <img
                    src={
                      uploadedSourceImageUrl ?? latestVariant?.sourceImageUrl
                    }
                    alt="Исходная фотография"
                    className="max-h-56 rounded-md border object-contain"
                  />
                )}

                <div className="flex items-center gap-3">
                  <input
                    id="source-image-upload"
                    type="file"
                    accept="image/*"
                    className="block text-sm"
                    onChange={handleFileChange}
                    disabled={uploadImageMutation.isPending}
                  />

                  {selectedFileName && (
                    <span className="text-sm text-muted-foreground">
                      {selectedFileName}
                    </span>
                  )}
                </div>

                {uploadImageMutation.isError && (
                  <Error description="Не удалось загрузить изображение" />
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="main-text" className="text-sm font-medium">
                  Текст для макета
                </label>

                <Textarea
                  id="main-text"
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  placeholder="Введите текст для генерации"
                  rows={4}
                />
              </div>

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
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="text-lg font-semibold">Результат</div>

          {!latestVariant && (
            <Card>
              <CardContent className="py-10 text-sm text-muted-foreground">
                Пока нет сгенерированных вариантов
              </CardContent>
            </Card>
          )}

          {latestVariant && (
            <Card>
              <CardContent className="space-y-4 pt-6">
                <img
                  src={latestVariant.resultWebp}
                  alt={latestVariant.mainText}
                  className="max-h-[640px] rounded-md border object-contain"
                />

                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <a
                      href={latestVariant.resultPng}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Скачать PNG
                    </a>
                  </Button>

                  <Button asChild variant="outline">
                    <a
                      href={latestVariant.resultWebp}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Открыть WEBP
                    </a>
                  </Button>
                </div>
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
                    <img
                      src={item.resultWebp}
                      alt={item.mainText}
                      className="h-64 w-full rounded-md border object-cover"
                    />

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
