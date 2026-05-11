import { useRef } from 'react';
import {
  AlignLeft,
  Image,
  ImagePlus,
  Layers,
  SquarePen,
  Trash2,
  Type,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { AnyLayer, EditorState } from './useEditorState';

// ─── Icons per layer type ─────────────────────────────────────────────────────

function layerIcon(layer: AnyLayer): React.ReactNode {
  if (layer.type === 'text') {
    return layer.editable ? (
      <SquarePen className="h-3.5 w-3.5 text-blue-400" />
    ) : (
      <Type className="h-3.5 w-3.5" />
    );
  }
  const icons: Record<string, React.ReactNode> = {
    photo: <ImagePlus className="h-3.5 w-3.5 text-blue-400" />,
    image: <Image className="h-3.5 w-3.5" />,
    gradient: <Layers className="h-3.5 w-3.5" />,
  };
  return icons[layer.type] ?? <AlignLeft className="h-3.5 w-3.5" />;
}

function layerLabel(layer: AnyLayer): string {
  switch (layer.type) {
    case 'text':
      return layer.editable
        ? `[Ред.] ${layer.name}`
        : `Текст: ${layer.defaultText?.slice(0, 20) ?? layer.name}`;
    case 'photo':
      return `Фото: ${layer.name}`;
    case 'image':
      return `Изображение: ${layer.file.split('/').pop() ?? layer.file}`;
    case 'gradient':
      return 'Градиент';
    default:
      return 'Слой';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  const addLayer = (factory: () => AnyLayer) => onAddLayer(factory());

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Слои
      </div>

      {/* Layer list — reversed: top layer shown first */}
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
                if (
                  dragIdxRef.current !== null &&
                  dragIdxRef.current !== realIdx
                ) {
                  onReorderLayer(dragIdxRef.current, realIdx);
                }
                dragIdxRef.current = null;
              }}
              onClick={() => onSelectLayer(entry._id)}
              className={[
                'flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm',
                isSelected
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground',
              ].join(' ')}
            >
              <span className="shrink-0">{layerIcon(entry.layer)}</span>
              <span className="flex-1 truncate">{layerLabel(entry.layer)}</span>
              <button
                className="shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLayer(entry._id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive hover:text-destructive" />
              </button>
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Нет слоёв. Добавьте слой ниже.
          </p>
        )}
      </div>

      {/* Add layer buttons */}
      <div className="border-t pt-2">
        <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Добавить слой
        </div>
        <div className="flex flex-col gap-1 overflow-x-auto">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={() =>
              addLayer(() => ({
                type: 'photo' as const,
                name: `photo${entries.filter((e) => e.layer.type === 'photo').length + 1}`,
                box: [0, 0, canvas.width, canvas.height],
                crop: 'cover',
                gravity: 'center',
              }))
            }
          >
            <ImagePlus className="mr-1 h-3.5 w-3.5" />
            Фото
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={() =>
              addLayer(() => ({
                type: 'text' as const,
                name: `text${textCount + 1}`,
                defaultText: `Текст ${textCount + 1}`,
                editable: false,
                box: [50, 50, Math.round(canvas.width * 0.8), 100],
                color: '#000000',
                fontSize: [16, 48] as [number, number],
                align: 'left',
              }))
            }
          >
            <Type className="mr-1 h-3.5 w-3.5" />
            Текст
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={() =>
              addLayer(() => ({
                type: 'image' as const,
                file: '',
                box: [0, 0, 200, 200],
                align: 'center',
              }))
            }
          >
            <Image className="mr-1 h-3.5 w-3.5" />
            Изображение
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={() =>
              addLayer(() => ({
                type: 'gradient' as const,
                box: [
                  0,
                  Math.round(canvas.height * 0.5),
                  canvas.width,
                  Math.round(canvas.height * 0.5),
                ],
                colorFrom: 'rgba(0,0,0,0)',
                colorTo: 'rgba(0,0,0,200)',
                direction: 'top_to_bottom',
              }))
            }
          >
            <Layers className="mr-1 h-3.5 w-3.5" />
            Градиент
          </Button>
        </div>
      </div>
    </div>
  );
};
