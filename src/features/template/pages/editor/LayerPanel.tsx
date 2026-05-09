import { useRef } from 'react';
import {
  AlignLeft,
  Image,
  ImagePlus,
  Layers,
  Minus,
  PaintBucket,
  RectangleHorizontal,
  Sun,
  Type,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { AnyLayer, EditorState } from './useEditorState';

// ─── Icons per layer type ─────────────────────────────────────────────────────

const LAYER_ICONS: Record<string, React.ReactNode> = {
  background: <PaintBucket className="h-3.5 w-3.5" />,
  photo: <ImagePlus className="h-3.5 w-3.5" />,
  image: <Image className="h-3.5 w-3.5" />,
  text: <Type className="h-3.5 w-3.5" />,
  gradient: <Layers className="h-3.5 w-3.5" />,
  rect: <RectangleHorizontal className="h-3.5 w-3.5" />,
  color_tint: <Sun className="h-3.5 w-3.5" />,
};

function layerLabel(layer: AnyLayer): string {
  switch (layer.type) {
    case 'text':
      return layer.defaultText ? `Текст: ${layer.defaultText.slice(0, 20)}` : `Текст: ${layer.name}`;
    case 'photo':
      return `Фото: ${layer.name}`;
    case 'image':
      return `Лого: ${layer.file.split('/').pop() ?? layer.file}`;
    case 'gradient':
      return 'Градиент';
    case 'rect':
      return 'Прямоугольник';
    case 'background':
      return 'Фон';
    case 'color_tint':
      return 'Цветовой слой';
    default:
      return 'Слой';
  }
}

// ─── Add-layer presets ────────────────────────────────────────────────────────

interface LayerPanelProps {
  state: EditorState;
  onAddLayer: (layer: AnyLayer) => void;
  onRemoveLayer: (id: string) => void;
  onSelectLayer: (id: string) => void;
  onReorderLayer: (fromIndex: number, toIndex: number) => void;
}

export const LayerPanel = ({
  state,
  onAddLayer,
  onRemoveLayer,
  onSelectLayer,
  onReorderLayer,
}: LayerPanelProps) => {
  const { entries, selectedId, canvas } = state;
  const dragIdxRef = useRef<number | null>(null);

  const textCount = entries.filter((e) => e.layer.type === 'text').length;

  const defaultLayers: Record<string, () => AnyLayer> = {
    Фото: () => ({
      type: 'photo' as const,
      name: `photo${entries.filter((e) => e.layer.type === 'photo').length + 1}`,
      box: [0, 0, canvas.width, canvas.height],
      crop: 'cover',
      gravity: 'center',
    }),
    Текст: () => ({
      type: 'text' as const,
      name: `text${textCount + 1}`,
      defaultText: `Текст ${textCount + 1}`,
      editable: true,
      box: [50, 50, Math.round(canvas.width * 0.8), 100],
      color: '#000000',
      fontSize: [16, 48] as [number, number],
      align: 'left',
    }),
    Изображение: () => ({
      type: 'image' as const,
      file: '',
      box: [0, 0, 200, 200],
      align: 'center',
    }),
    Градиент: () => ({
      type: 'gradient' as const,
      box: [0, Math.round(canvas.height * 0.5), canvas.width, Math.round(canvas.height * 0.5)],
      colorFrom: 'rgba(0,0,0,0)',
      colorTo: 'rgba(0,0,0,200)',
      direction: 'top_to_bottom',
    }),
    Прямоугольник: () => ({
      type: 'rect' as const,
      box: [50, 50, 200, 100],
      color: '#cccccc',
      opacity: 1,
    }),
    'Цвет. тинт': () => ({
      type: 'color_tint' as const,
      color: 'rgba(0,0,0,80)',
    }),
    Фон: () => ({
      type: 'background' as const,
      color: '#ffffff',
    }),
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Слои
      </div>

      {/* Layer list — reverse display (top layers visually first) */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {[...entries].reverse().map((entry, revIdx) => {
          const realIdx = entries.length - 1 - revIdx;
          const isSelected = entry._id === selectedId;

          return (
            <div
              key={entry._id}
              draggable
              onDragStart={() => (dragIdxRef.current = realIdx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIdxRef.current !== null && dragIdxRef.current !== realIdx) {
                  onReorderLayer(dragIdxRef.current, realIdx);
                }
                dragIdxRef.current = null;
              }}
              onClick={() => onSelectLayer(entry._id)}
              className={[
                'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm select-none',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground',
              ].join(' ')}
            >
              <span className="shrink-0">{LAYER_ICONS[entry.layer.type] ?? <AlignLeft className="h-3.5 w-3.5" />}</span>
              <span className="flex-1 truncate">{layerLabel(entry.layer)}</span>
              <button
                className="shrink-0 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLayer(entry._id);
                }}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="text-xs text-muted-foreground">Нет слоёв. Добавьте слой ниже.</p>
        )}
      </div>

      {/* Add layer buttons */}
      <div className="border-t pt-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
          Добавить слой
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.entries(defaultLayers).map(([label, factory]) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onAddLayer(factory())}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
