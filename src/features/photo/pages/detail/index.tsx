import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const MAX_DISPLAY_SIZE = 450;

// ─── Image position modal ─────────────────────────────────────────────────────

interface ImagePositionModalProps {
  open: boolean;
  file: File | null;
  dimensions: { width: number; height: number };
  fieldLabel: string;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

const ImagePositionModal = ({
  open,
  file,
  dimensions,
  fieldLabel,
  onConfirm,
  onCancel,
}: ImagePositionModalProps) => {
  const containerScale = Math.min(
    MAX_DISPLAY_SIZE / dimensions.width,
    MAX_DISPLAY_SIZE / dimensions.height,
  );
  const displayW = Math.round(dimensions.width * containerScale);
  const displayH = Math.round(dimensions.height * containerScale);

  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      setImgSize(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleImgLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    // Display image at containerScale so 1 image pixel = 1 template pixel in the viewport
    const dW = img.naturalWidth * containerScale;
    const dH = img.naturalHeight * containerScale;
    setImgSize({ w: dW, h: dH });
    setOffset({
      x: Math.round((displayW - dW) / 2),
      y: Math.round((displayH - dH) / 2),
    });
  }, [displayW, displayH, containerScale]);

  // Only clamp axes where the image is larger than the frame (prevent blank strips)
  const clampedOffset = useCallback(
    (x: number, y: number, iw: number, ih: number) => ({
      x: iw > displayW ? Math.min(0, Math.max(displayW - iw, x)) : x,
      y: ih > displayH ? Math.min(0, Math.max(displayH - ih, y)) : y,
    }),
    [displayW, displayH],
  );

  const handleConfirm = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !imgSize) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop the exact region of the original image that maps to the frame.
    // offset is image top-left relative to frame; invert and unscale to get source coords.
    const srcX = -offset.x / containerScale;
    const srcY = -offset.y / containerScale;
    const srcW = displayW / containerScale; // equals dimensions.width
    const srcH = displayH / containerScale; // equals dimensions.height
    ctx.drawImage(
      img,
      srcX, srcY, srcW, srcH,
      0, 0, dimensions.width, dimensions.height,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onConfirm(
          new File([blob], file?.name ?? 'image.jpg', { type: 'image/jpeg' }),
        );
      },
      'image/jpeg',
      0.95,
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-fit" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Настройте изображение: {fieldLabel}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Перетащите изображение, чтобы выбрать нужную область (
          {dimensions.width}×{dimensions.height})
        </p>

        <div
          className="relative overflow-hidden rounded border bg-muted select-none"
          style={{ width: displayW, height: displayH }}
        >
          {objectUrl && (
            <img
              ref={imgRef}
              src={objectUrl}
              alt="preview"
              draggable={false}
              onLoad={handleImgLoad}
              onPointerDown={(e) => {
                e.preventDefault();
                draggingRef.current = true;
                lastPointerRef.current = { x: e.clientX, y: e.clientY };
                (e.currentTarget as Element).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!draggingRef.current || !imgSize) return;
                const dx = e.clientX - lastPointerRef.current.x;
                const dy = e.clientY - lastPointerRef.current.y;
                lastPointerRef.current = { x: e.clientX, y: e.clientY };
                setOffset((prev) =>
                  clampedOffset(prev.x + dx, prev.y + dy, imgSize.w, imgSize.h),
                );
              }}
              onPointerUp={() => {
                draggingRef.current = false;
              }}
              className="absolute cursor-grab active:cursor-grabbing select-none"
              style={
                imgSize
                  ? {
                      width: imgSize.w,
                      height: imgSize.h,
                      left: offset.x,
                      top: offset.y,
                    }
                  : { opacity: 0 }
              }
            />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button onClick={handleConfirm} disabled={!imgSize}>
            Применить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : currentUrl
      ? `${currentUrl}`
      : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (inputRef.current) inputRef.current.value = '';
    if (field.dimensions) {
      setPendingFile(file);
    } else {
      onFileSelect(file);
    }
  };

  return (
    <div className="grid gap-2">
      <Label>{field.label}</Label>
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
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
      {field.dimensions && (
        <ImagePositionModal
          open={pendingFile !== null}
          file={pendingFile}
          dimensions={field.dimensions}
          fieldLabel={field.label}
          onConfirm={(croppedFile) => {
            setPendingFile(null);
            onFileSelect(croppedFile);
          }}
          onCancel={() => setPendingFile(null)}
        />
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
    <PageWrapper size="wide" header={<PageHeading>{session.title}</PageHeading>}>
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
