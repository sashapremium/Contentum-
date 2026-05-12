import { useRef, useState } from 'react';
import { Layers, Trash2, Upload } from 'lucide-react';

import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { EditorEntry, FontEntry, ImageAsset } from './useEditorState';

// ─── helpers ─────────────────────────────────────────────────────────────────

function countFontUsages(entries: EditorEntry[], fontKey: string) {
  return entries.filter(
    (e) => e.layer.type === 'text' && e.layer.font === fontKey,
  ).length;
}

function countImageUsages(entries: EditorEntry[], path: string) {
  return entries.filter(
    (e) => e.layer.type === 'image' && e.layer.file === path,
  ).length;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AssetManagerProps {
  fonts: FontEntry[];
  imageAssets: ImageAsset[];
  entries: EditorEntry[];
  onAddFont: (font: FontEntry) => void;
  onRemoveFont: (key: string) => void;
  onAddImage: (asset: ImageAsset) => void;
  onRemoveImage: (path: string) => void;
}

export const AssetManager = ({
  fonts,
  imageAssets,
  entries,
  onAddFont,
  onRemoveFont,
  onAddImage,
  onRemoveImage,
}: AssetManagerProps) => {
  const fontFileRef = useRef<HTMLInputElement>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const [deleteFont, setDeleteFont] = useState<FontEntry | null>(null);
  const [deleteImage, setDeleteImage] = useState<ImageAsset | null>(null);

  const handleFontUpload = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'otf';
    const key = file.name.replace(/\.[^.]+$/, '').replace(/\s+/g, '_');
    const family = key;
    const path = `fonts/${key}.${ext}`;

    file.arrayBuffer().then((buf) => {
      const ff = new FontFace(family, buf);
      ff.load().then((loaded) => document.fonts.add(loaded));
    });

    onAddFont({ key, file: path, family, pendingFile: file, objectUrl: URL.createObjectURL(file) });
    if (fontFileRef.current) fontFileRef.current.value = '';
  };

  const handleImageUpload = (file: File) => {
    const safeName = file.name.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
    const path = `images/${safeName}`;
    const previewUrl = URL.createObjectURL(file);
    onAddImage({ path, pendingFile: file, previewUrl });
    if (imgFileRef.current) imgFileRef.current.value = '';
  };

  const handleFontDelete = (font: FontEntry) => {
    if (countFontUsages(entries, font.key) > 0) {
      setDeleteFont(font);
    } else {
      onRemoveFont(font.key);
    }
  };

  const handleImageDelete = (asset: ImageAsset) => {
    if (countImageUsages(entries, asset.path) > 0) {
      setDeleteImage(asset);
    } else {
      onRemoveImage(asset.path);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Layers className="mr-2 h-4 w-4" />
            Ресурсы
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[500px] px-6">
          <SheetHeader>
            <SheetTitle>Менеджер ресурсов</SheetTitle>
          </SheetHeader>
          <Tabs defaultValue="fonts" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="fonts" className="flex-1">
                Шрифты ({fonts.length})
              </TabsTrigger>
              <TabsTrigger value="images" className="flex-1">
                Изображения ({imageAssets.length})
              </TabsTrigger>
            </TabsList>

            {/* ── Fonts tab ──────────────────────────────────────────── */}
            <TabsContent value="fonts" className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fontFileRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Загрузить .otf / .ttf
                </Button>
                <input
                  ref={fontFileRef}
                  type="file"
                  accept=".otf,.ttf,.woff,.woff2"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFontUpload(f);
                  }}
                />
              </div>

              <div className="space-y-2">
                {fonts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Шрифты не загружены
                  </p>
                )}
                {fonts.map((font) => (
                  <div
                    key={font.key}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{font.key}</p>
                      <p className="text-xs text-muted-foreground">
                        {font.family}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFontDelete(font)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── Images tab ─────────────────────────────────────────── */}
            <TabsContent value="images" className="space-y-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => imgFileRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Загрузить изображение
              </Button>
              <input
                ref={imgFileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                }}
              />

              <div className="space-y-2">
                {imageAssets.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Изображения не загружены
                  </p>
                )}
                {imageAssets.map((asset) => (
                  <div
                    key={asset.path}
                    className="flex items-center gap-2 rounded border p-2"
                  >
                    {asset.previewUrl && (
                      <img
                        src={asset.previewUrl}
                        alt={asset.path}
                        className="h-10 w-10 rounded object-contain"
                      />
                    )}
                    <p className="flex-1 truncate text-sm">{asset.path}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleImageDelete(asset)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deleteFont}
        onOpenChange={(o) => !o && setDeleteFont(null)}
        title="Удалить шрифт?"
        description={`Шрифт «${deleteFont?.key}» используется в ${countFontUsages(entries, deleteFont?.key ?? '')} слоях. Удалить всё равно?`}
        confirmText="Удалить"
        onClickConfirm={() => {
          if (deleteFont) onRemoveFont(deleteFont.key);
          setDeleteFont(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteImage}
        onOpenChange={(o) => !o && setDeleteImage(null)}
        title="Удалить изображение?"
        description={`Изображение используется в ${countImageUsages(entries, deleteImage?.path ?? '')} слоях. Удалить всё равно?`}
        confirmText="Удалить"
        onClickConfirm={() => {
          if (deleteImage) onRemoveImage(deleteImage.path);
          setDeleteImage(null);
        }}
      />
    </>
  );
};
