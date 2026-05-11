import { HexColorInput, HexColorPicker } from 'react-colorful';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { AnyLayer, EditorState, FontEntry, ImageAsset } from './useEditorState';

// ─── Small reusable field components ─────────────────────────────────────────

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <Label className="text-xs">{label}</Label>
    {children}
  </div>
);

const NumInput = ({
  value,
  onChange,
  label,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  min?: number;
  max?: number;
}) => (
  <Field label={label}>
    <Input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-7 text-sm"
    />
  </Field>
);

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const safeHex = value.startsWith('#') ? value : '#000000';
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 shrink-0 rounded border" style={{ backgroundColor: safeHex }} />
        <HexColorInput
          color={safeHex}
          onChange={onChange}
          prefixed
          className="h-7 flex-1 rounded border px-2 font-mono text-xs"
        />
      </div>
      <HexColorPicker color={safeHex} onChange={onChange} style={{ width: '100%', height: 120 }} />
    </Field>
  );
};

// Parse rgba(R,G,B,A) where A is 0-255, or #RRGGBB
function parseRgba(str: string): { r: number; g: number; b: number; a: number } {
  const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\s*\)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 255 };
  const hex = str.replace('#', '');
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 255,
    };
  }
  return { r: 0, g: 0, b: 0, a: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

const RgbaColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const { r, g, b, a } = parseRgba(value);
  const hex = rgbToHex(r, g, b);

  const handleHex = (newHex: string) => {
    const h = newHex.replace('#', '');
    if (h.length === 6) {
      onChange(`rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`);
    }
  };

  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 shrink-0 rounded border"
          style={{ backgroundColor: hex, opacity: a / 255 }}
        />
        <HexColorInput color={hex} onChange={handleHex} prefixed className="h-7 flex-1 rounded border px-2 font-mono text-xs" />
      </div>
      <HexColorPicker color={hex} onChange={handleHex} style={{ width: '100%', height: 120 }} />
      <Field label={`Прозрачность: ${Math.round((a / 255) * 100)}%`}>
        <input
          type="range"
          min={0}
          max={255}
          value={a}
          onChange={(e) => onChange(`rgba(${r},${g},${b},${Number(e.target.value)})`)}
          className="w-full"
        />
      </Field>
    </Field>
  );
};

const BoxFields = ({
  box,
  onChange,
}: {
  box: [number, number, number, number];
  onChange: (box: [number, number, number, number]) => void;
}) => (
  <div className="grid grid-cols-2 gap-2">
    <NumInput label="X" value={box[0]} onChange={(v) => onChange([v, box[1], box[2], box[3]])} />
    <NumInput label="Y" value={box[1]} onChange={(v) => onChange([box[0], v, box[2], box[3]])} />
    <NumInput label="Ш" value={box[2]} min={1} onChange={(v) => onChange([box[0], box[1], v, box[3]])} />
    <NumInput label="В" value={box[3]} min={1} onChange={(v) => onChange([box[0], box[1], box[2], v])} />
  </div>
);

const OpacityField = ({
  value = 1,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) => (
  <Field label={`Непрозрачность: ${Math.round((value ?? 1) * 100)}%`}>
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={value ?? 1}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  </Field>
);

// ─── Per-layer property panels ────────────────────────────────────────────────

interface LayerPropsProps {
  layer: AnyLayer;
  fonts: FontEntry[];
  imageAssets: ImageAsset[];
  onChange: (layer: AnyLayer) => void;
}

const PhotoProps = ({ layer, onChange }: LayerPropsProps) => {
  if (layer.type !== 'photo') return null;
  return (
    <>
      <BoxFields box={layer.box} onChange={(b) => onChange({ ...layer, box: b })} />
      <Field label="Ключ слота">
        <Input
          value={layer.name}
          onChange={(e) => onChange({ ...layer, name: e.target.value })}
          className="h-7 text-sm"
        />
      </Field>
      <Field label="Позиция обрезки">
        <Select
          value={layer.gravity ?? 'center'}
          onValueChange={(v) => onChange({ ...layer, gravity: v })}
        >
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="center">По центру</SelectItem>
            <SelectItem value="top">Сверху</SelectItem>
            <SelectItem value="bottom">Снизу</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </>
  );
};

const GradientProps = ({ layer, onChange }: LayerPropsProps) => {
  if (layer.type !== 'gradient') return null;
  return (
    <>
      <BoxFields box={layer.box} onChange={(b) => onChange({ ...layer, box: b })} />
      <RgbaColorField
        label="Цвет начала (прозрачный)"
        value={layer.colorFrom}
        onChange={(c) => onChange({ ...layer, colorFrom: c })}
      />
      <RgbaColorField
        label="Цвет конца (непрозрачный)"
        value={layer.colorTo}
        onChange={(c) => onChange({ ...layer, colorTo: c })}
      />
      <OpacityField value={layer.opacity} onChange={(v) => onChange({ ...layer, opacity: v })} />
    </>
  );
};

const ImageLayerProps = ({ layer, onChange, imageAssets }: LayerPropsProps) => {
  if (layer.type !== 'image') return null;
  const isSvg = layer.file.toLowerCase().endsWith('.svg');
  return (
    <>
      <BoxFields box={layer.box} onChange={(b) => onChange({ ...layer, box: b })} />
      <Field label="Файл (из ресурсов)">
        <Select
          value={layer.file || '__none__'}
          onValueChange={(v) => onChange({ ...layer, file: v === '__none__' ? '' : v })}
        >
          <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="Выбрать..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— не выбран —</SelectItem>
            {imageAssets.map((a) => (
              <SelectItem key={a.path} value={a.path}>{a.path}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Выравнивание">
        <Select
          value={layer.align ?? 'center'}
          onValueChange={(v) => onChange({ ...layer, align: v })}
        >
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Слева</SelectItem>
            <SelectItem value="center">По центру</SelectItem>
            <SelectItem value="right">Справа</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <OpacityField value={layer.opacity} onChange={(v) => onChange({ ...layer, opacity: v })} />
      {isSvg && (
        <RgbaField
          label="Цвет тинта (SVG)"
          value={layer.tintColor ?? ''}
          onChange={(c) => onChange({ ...layer, tintColor: c })}
        />
      )}
    </>
  );
};

const TextLayerProps = ({ layer, onChange, fonts }: LayerPropsProps) => {
  if (layer.type !== 'text') return null;
  const isEditable = layer.editable === true;
  return (
    <>
      {isEditable && (
        <div className="rounded border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs text-blue-700">
          Поле ввода — пользователь заполняет текст при создании фото
        </div>
      )}
      <BoxFields box={layer.box} onChange={(b) => onChange({ ...layer, box: b })} />
      <Field label="Ключ поля (name)">
        <Input
          value={layer.name}
          onChange={(e) => onChange({ ...layer, name: e.target.value })}
          className="h-7 text-sm"
        />
      </Field>
      <Field label="Текст по умолчанию">
        <Input
          value={layer.defaultText ?? ''}
          onChange={(e) => onChange({ ...layer, defaultText: e.target.value })}
          className="h-7 text-sm"
        />
      </Field>
      <Field label="Редактируемый пользователем">
        <Select
          value={isEditable ? 'yes' : 'no'}
          onValueChange={(v) => onChange({ ...layer, editable: v === 'yes' })}
        >
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Да — пользователь вводит текст</SelectItem>
            <SelectItem value="no">Нет — фиксированный текст</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Шрифт">
        <Select
          value={layer.font ?? '__default__'}
          onValueChange={(v) => onChange({ ...layer, font: v === '__default__' ? undefined : v })}
        >
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__default__">Times New Roman</SelectItem>
            {fonts.map((f) => (
              <SelectItem key={f.key} value={f.key}>{f.family} ({f.key})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <ColorField
        label="Цвет текста"
        value={layer.color ?? '#000000'}
        onChange={(c) => onChange({ ...layer, color: c })}
      />
      <div className="grid grid-cols-2 gap-2">
        <NumInput
          label="Мин. размер"
          value={layer.fontSize?.[0] ?? 16}
          min={6}
          max={400}
          onChange={(v) => onChange({ ...layer, fontSize: [v, layer.fontSize?.[1] ?? 48] as [number, number] })}
        />
        <NumInput
          label="Макс. размер"
          value={layer.fontSize?.[1] ?? 48}
          min={6}
          max={400}
          onChange={(v) => onChange({ ...layer, fontSize: [layer.fontSize?.[0] ?? 16, v] as [number, number] })}
        />
        <NumInput
          label="Макс. строк"
          value={layer.maxLines ?? 1}
          min={1}
          onChange={(v) => onChange({ ...layer, maxLines: v })}
        />
        <NumInput
          label="Макс. символов"
          value={layer.maxLength ?? 200}
          min={1}
          onChange={(v) => onChange({ ...layer, maxLength: v })}
        />
      </div>
      <Field label="Горизонт. выравнивание">
        <Select
          value={layer.align ?? 'left'}
          onValueChange={(v) => onChange({ ...layer, align: v })}
        >
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Слева</SelectItem>
            <SelectItem value="center">По центру</SelectItem>
            <SelectItem value="right">Справа</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Верт. выравнивание">
        <Select
          value={layer.verticalAlign ?? 'top'}
          onValueChange={(v) => onChange({ ...layer, verticalAlign: v })}
        >
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Сверху</SelectItem>
            <SelectItem value="center">По центру</SelectItem>
            <SelectItem value="bottom">Снизу</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </>
  );
};

// ─── Main PropertiesPanel ─────────────────────────────────────────────────────

interface PropertiesPanelProps {
  state: EditorState;
  onUpdateLayer: (id: string, layer: AnyLayer) => void;
}

export const PropertiesPanel = ({ state, onUpdateLayer }: PropertiesPanelProps) => {
  const selected = state.entries.find((e) => e._id === state.selectedId);

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Выберите слой</p>
      </div>
    );
  }

  const { layer } = selected;
  const handleChange = (updated: AnyLayer) => onUpdateLayer(selected._id, updated);

  const props: LayerPropsProps = {
    layer,
    fonts: state.fonts,
    imageAssets: state.imageAssets,
    onChange: handleChange,
  };

  const typeLabel: Record<string, string> = {
    photo: 'Фото-слот',
    gradient: 'Градиент',
    image: 'Изображение',
    text: layer.type === 'text' && layer.editable ? 'Ред. текст' : 'Текст',
  };

  return (
    <div className="space-y-3 overflow-y-auto px-1">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {typeLabel[layer.type] ?? layer.type}
      </div>
      {layer.type === 'photo' && <PhotoProps {...props} />}
      {layer.type === 'gradient' && <GradientProps {...props} />}
      {layer.type === 'image' && <ImageLayerProps {...props} />}
      {layer.type === 'text' && <TextLayerProps {...props} />}
    </div>
  );
};
