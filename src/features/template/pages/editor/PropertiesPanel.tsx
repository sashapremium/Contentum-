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

import type {
  AnyLayer,
  EditorState,
  FontEntry,
  ImageAsset,
} from './useEditorState';

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
        <div
          className="h-7 w-7 shrink-0 cursor-pointer rounded border"
          style={{ backgroundColor: safeHex }}
        />
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

const RgbaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <Field label={label}>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="rgba(0,0,0,128) or #RRGGBB"
      className="h-7 font-mono text-xs"
    />
    <p className="text-[10px] text-muted-foreground">rgba(R,G,B,0-255) или #RRGGBB</p>
  </Field>
);

// ─── Box fields (position + size) ────────────────────────────────────────────

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

// ─── Opacity slider ───────────────────────────────────────────────────────────

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

// ─── Properties per layer type ────────────────────────────────────────────────

interface LayerPropsProps {
  layer: AnyLayer;
  fonts: FontEntry[];
  imageAssets: ImageAsset[];
  onChange: (layer: AnyLayer) => void;
}

const BackgroundProps = ({ layer, onChange }: LayerPropsProps) => {
  if (layer.type !== 'background') return null;
  return (
    <ColorField label="Цвет фона" value={layer.color} onChange={(c) => onChange({ ...layer, color: c })} />
  );
};

const RectProps = ({ layer, onChange }: LayerPropsProps) => {
  if (layer.type !== 'rect') return null;
  return (
    <>
      <BoxFields box={layer.box} onChange={(b) => onChange({ ...layer, box: b })} />
      <ColorField label="Цвет" value={layer.color} onChange={(c) => onChange({ ...layer, color: c })} />
      <OpacityField value={layer.opacity} onChange={(v) => onChange({ ...layer, opacity: v })} />
    </>
  );
};

const ColorTintProps = ({ layer, onChange }: LayerPropsProps) => {
  if (layer.type !== 'color_tint') return null;
  return (
    <>
      <RgbaField label="Цвет тинта" value={layer.color} onChange={(c) => onChange({ ...layer, color: c })} />
      {layer.box && (
        <BoxFields box={layer.box} onChange={(b) => onChange({ ...layer, box: b })} />
      )}
    </>
  );
};

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
      <Field label="Обрезка">
        <Select value={layer.gravity ?? 'center'} onValueChange={(v) => onChange({ ...layer, gravity: v })}>
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
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
      <RgbaField
        label="Цвет начала (прозрачный)"
        value={layer.colorFrom}
        onChange={(c) => onChange({ ...layer, colorFrom: c })}
      />
      <RgbaField
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
        <Select value={layer.file || '__none__'} onValueChange={(v) => onChange({ ...layer, file: v === '__none__' ? '' : v })}>
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
        <Select value={layer.align ?? 'center'} onValueChange={(v) => onChange({ ...layer, align: v })}>
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
  return (
    <>
      <BoxFields box={layer.box} onChange={(b) => onChange({ ...layer, box: b })} />
      <Field label="Ключ поля">
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
      <Field label="Шрифт">
        <Select value={layer.font ?? '__default__'} onValueChange={(v) => onChange({ ...layer, font: v === '__default__' ? undefined : v })}>
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__default__">Times New Roman</SelectItem>
            {fonts.map((f) => (
              <SelectItem key={f.key} value={f.key}>{f.family} ({f.key})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <ColorField label="Цвет текста" value={layer.color ?? '#000000'} onChange={(c) => onChange({ ...layer, color: c })} />
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
        <Select value={layer.align ?? 'left'} onValueChange={(v) => onChange({ ...layer, align: v })}>
          <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Слева</SelectItem>
            <SelectItem value="center">По центру</SelectItem>
            <SelectItem value="right">Справа</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Верт. выравнивание">
        <Select value={layer.verticalAlign ?? 'top'} onValueChange={(v) => onChange({ ...layer, verticalAlign: v })}>
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

  const handleChange = (updated: AnyLayer) => {
    onUpdateLayer(selected._id, updated);
  };

  const props: LayerPropsProps = {
    layer,
    fonts: state.fonts,
    imageAssets: state.imageAssets,
    onChange: handleChange,
  };

  return (
    <div className="space-y-3 overflow-y-auto px-1">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {layer.type}
      </div>
      {layer.type === 'background' && <BackgroundProps {...props} />}
      {layer.type === 'rect' && <RectProps {...props} />}
      {layer.type === 'color_tint' && <ColorTintProps {...props} />}
      {layer.type === 'photo' && <PhotoProps {...props} />}
      {layer.type === 'gradient' && <GradientProps {...props} />}
      {layer.type === 'image' && <ImageLayerProps {...props} />}
      {layer.type === 'text' && <TextLayerProps {...props} />}
    </div>
  );
};
