// Панель свойств выбранного слоя. Рендерит нужный набор полей по типу слоя.

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
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
      className="text-sm"
    />
  </Field>
);

const SliderField = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  displayValue?: (v: number) => string;
  onChange: (v: number) => void;
}) => {
  const [local, setLocal] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  if (prevValue !== value) {
    setPrevValue(value);
    setLocal(value);
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [value]);

  const handleChange = (vals: number[]) => {
    setLocal(vals[0]);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChangeRef.current(vals[0]), 500);
  };

  const display = displayValue ? displayValue(local) : String(local);

  return (
    <Field label={`${label}: ${display}`}>
      <Slider
        value={[local]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
      />
    </Field>
  );
};

const anyInt = z
  .string()
  .refine((v) => /^-?\d+$/.test(v), { message: 'Целое число' });

const boxSchema = z.object({ x: anyInt, y: anyInt, w: anyInt, h: anyInt });
type BoxFormValues = z.infer<typeof boxSchema>;

const BOX_FIELDS = [
  { name: 'x' as const, label: 'X' },
  { name: 'y' as const, label: 'Y' },
  { name: 'w' as const, label: 'Ширина' },
  { name: 'h' as const, label: 'Высота' },
];

const BoxFields = ({
  box,
  onChange,
}: {
  box: [number, number, number, number];
  onChange: (box: [number, number, number, number]) => void;
}) => {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const form = useForm<BoxFormValues>({
    resolver: zodResolver(boxSchema),
    defaultValues: {
      x: String(box[0]),
      y: String(box[1]),
      w: String(box[2]),
      h: String(box[3]),
    },
    mode: 'onChange',
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBoxRef = useRef<[number, number, number, number]>(box);

  useEffect(() => {
    const [bx, by, bw, bh] = box;
    const [lx, ly, lw, lh] = lastBoxRef.current;
    if (bx === lx && by === ly && bw === lw && bh === lh) return;
    lastBoxRef.current = [bx, by, bw, bh];
    form.reset({ x: String(bx), y: String(by), w: String(bw), h: String(bh) });
  }, [box[0], box[1], box[2], box[3]]);

  const handleFieldChange = (field: keyof BoxFormValues, value: string) => {
    const current = { ...form.getValues(), [field]: value };
    const result = boxSchema.safeParse(current);

    if (!result.success) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const nx = parseInt(result.data.x, 10);
    const ny = parseInt(result.data.y, 10);
    const nw = parseInt(result.data.w, 10);
    const nh = parseInt(result.data.h, 10);

    const [lx, ly, lw, lh] = lastBoxRef.current;
    if (nx === lx && ny === ly && nw === lw && nh === lh) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const newBox: [number, number, number, number] = [nx, ny, nw, nh];
      lastBoxRef.current = newBox;
      onChangeRef.current(newBox);
    }, 500);
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 items-start gap-2">
        {BOX_FIELDS.map(({ name, label }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel className="text-xs">{label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    className="text-sm"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange(name, e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        ))}
      </div>
    </Form>
  );
};

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const safeHex = (v: string) => (v.startsWith('#') ? v : '#000000');
  const [local, setLocal] = useState(() => safeHex(value));
  const [prevValue, setPrevValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  if (prevValue !== value) {
    setPrevValue(value);
    setLocal(safeHex(value));
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [value]);

  const handleChange = (color: string) => {
    setLocal(color);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChangeRef.current(color), 500);
  };

  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 shrink-0 rounded border"
          style={{ backgroundColor: local }}
        />
        <HexColorInput
          color={local}
          onChange={handleChange}
          prefixed
          className="h-7 flex-1 rounded border px-2 font-mono text-xs"
        />
      </div>
      <HexColorPicker
        color={local}
        onChange={handleChange}
        style={{ width: '100%', height: 120 }}
      />
    </Field>
  );
};

function parseRgba(str: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const m = str.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\s*\)/,
  );
  if (m)
    return {
      r: +m[1],
      g: +m[2],
      b: +m[3],
      a: m[4] !== undefined ? +m[4] : 255,
    };
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
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
      .join('')
  );
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
  const [local, setLocal] = useState(() => parseRgba(value));
  const [prevValue, setPrevValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  if (prevValue !== value) {
    setPrevValue(value);
    setLocal(parseRgba(value));
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [value]);

  const fire = (next: { r: number; g: number; b: number; a: number }) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChangeRef.current(`rgba(${next.r},${next.g},${next.b},${next.a})`);
    }, 500);
  };

  const handleHex = (newHex: string) => {
    const h = newHex.replace('#', '');
    if (h.length === 6) {
      const next = {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: local.a,
      };
      setLocal(next);
      fire(next);
    }
  };

  const handleAlpha = (a: number) => {
    const next = { ...local, a };
    setLocal(next);
    fire(next);
  };

  const hex = rgbToHex(local.r, local.g, local.b);

  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 shrink-0 rounded border"
          style={{ backgroundColor: hex, opacity: local.a / 255 }}
        />
        <HexColorInput
          color={hex}
          onChange={handleHex}
          prefixed
          className="h-7 flex-1 rounded border px-2 font-mono text-xs"
        />
      </div>
      <HexColorPicker
        color={hex}
        onChange={handleHex}
        style={{ width: '100%', height: 120 }}
      />
      <Field label={`Прозрачность: ${Math.round((local.a / 255) * 100)}%`}>
        <Slider
          value={[local.a]}
          min={0}
          max={255}
          step={1}
          onValueChange={(vals) => handleAlpha(vals[0])}
        />
      </Field>
    </Field>
  );
};

const OpacityField = ({
  value = 1,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) => (
  <SliderField
    label="Непрозрачность"
    value={value ?? 1}
    min={0}
    max={1}
    step={0.01}
    displayValue={(v) => `${Math.round(v * 100)}%`}
    onChange={onChange}
  />
);

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
      <BoxFields
        box={layer.box}
        onChange={(b) => onChange({ ...layer, box: b })}
      />
      <Field label="Ключ слота">
        <Input
          value={layer.name}
          onChange={(e) => onChange({ ...layer, name: e.target.value })}
          className="w-full text-sm"
        />
      </Field>
      <Field label="Позиция обрезки">
        <Select
          value={layer.gravity ?? 'center'}
          onValueChange={(v) => onChange({ ...layer, gravity: v })}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue />
          </SelectTrigger>
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
      <BoxFields
        box={layer.box}
        onChange={(b) => onChange({ ...layer, box: b })}
      />
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
      <OpacityField
        value={layer.opacity}
        onChange={(v) => onChange({ ...layer, opacity: v })}
      />
    </>
  );
};

const ImageLayerProps = ({ layer, onChange, imageAssets }: LayerPropsProps) => {
  if (layer.type !== 'image') return null;

  return (
    <>
      <BoxFields
        box={layer.box}
        onChange={(b) => onChange({ ...layer, box: b })}
      />
      <Field label="Файл (из ресурсов)">
        <Select
          value={layer.file || '__none__'}
          onValueChange={(v) =>
            onChange({ ...layer, file: v === '__none__' ? '' : v })
          }
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Выбрать..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">- не выбран -</SelectItem>
            {imageAssets.map((a) => (
              <SelectItem key={a.path} value={a.path}>
                {a.path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Выравнивание">
        <Select
          value={layer.align ?? 'center'}
          onValueChange={(v) => onChange({ ...layer, align: v })}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Слева</SelectItem>
            <SelectItem value="center">По центру</SelectItem>
            <SelectItem value="right">Справа</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <OpacityField
        value={layer.opacity}
        onChange={(v) => onChange({ ...layer, opacity: v })}
      />
    </>
  );
};

const TextLayerProps = ({ layer, onChange, fonts }: LayerPropsProps) => {
  if (layer.type !== 'text') return null;
  const isEditable = layer.editable === true;
  return (
    <>
      {isEditable && (
        <div className="rounded border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs text-blue-600">
          Поле ввода - пользователь заполняет текст при создании фото
        </div>
      )}
      <BoxFields
        box={layer.box}
        onChange={(b) => onChange({ ...layer, box: b })}
      />
      <Field label="Название поля (name)">
        <Input
          value={layer.name}
          onChange={(e) => onChange({ ...layer, name: e.target.value })}
          className="text-sm"
        />
      </Field>
      <Field label="Текст по умолчанию">
        <Input
          value={layer.defaultText ?? ''}
          onChange={(e) => onChange({ ...layer, defaultText: e.target.value })}
          className="text-sm"
        />
      </Field>
      <Field label="Редактируемый пользователем">
        <Select
          value={isEditable ? 'yes' : 'no'}
          onValueChange={(v) => onChange({ ...layer, editable: v === 'yes' })}
        >
          <SelectTrigger className="text-sm w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Да - пользователь вводит текст</SelectItem>
            <SelectItem value="no">Нет - фиксированный текст</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Шрифт">
        <Select
          value={layer.font ?? '__default__'}
          onValueChange={(v) =>
            onChange({ ...layer, font: v === '__default__' ? undefined : v })
          }
        >
          <SelectTrigger className="text-sm w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__default__">Times New Roman</SelectItem>
            {fonts.map((f) => (
              <SelectItem key={f.key} value={f.key}>
                {f.family} ({f.key})
              </SelectItem>
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
          onChange={(v) =>
            onChange({
              ...layer,
              fontSize: [v, layer.fontSize?.[1] ?? 48] as [number, number],
            })
          }
        />
        <NumInput
          label="Макс. размер"
          value={layer.fontSize?.[1] ?? 48}
          min={6}
          max={400}
          onChange={(v) =>
            onChange({
              ...layer,
              fontSize: [layer.fontSize?.[0] ?? 16, v] as [number, number],
            })
          }
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
          <SelectTrigger className="text-sm w-full">
            <SelectValue />
          </SelectTrigger>
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
          <SelectTrigger className="text-sm w-full">
            <SelectValue />
          </SelectTrigger>
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

interface PropertiesPanelProps {
  state: EditorState;
  onUpdateLayer: (id: string, layer: AnyLayer) => void;
}

export const PropertiesPanel = ({
  state,
  onUpdateLayer,
}: PropertiesPanelProps) => {
  const selected = state.entries.find((e) => e._id === state.selectedId);

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Выберите слой</p>
      </div>
    );
  }

  const { layer } = selected;
  const handleChange = (updated: AnyLayer) =>
    onUpdateLayer(selected._id, updated);

  const props: LayerPropsProps = {
    layer,
    fonts: state.fonts,
    imageAssets: state.imageAssets,
    onChange: handleChange,
  };

  const typeLabel: Record<string, string> = {
    photo: 'Фото',
    gradient: 'Градиент',
    image: 'Изображение',
    text: layer.type === 'text' && layer.editable ? 'Ред. текст' : 'Текст',
  };

  return (
    <div className="space-y-3 pr-4">
      <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {typeLabel[layer.type] ?? layer.type}
      </div>
      {layer.type === 'photo' && <PhotoProps {...props} />}
      {layer.type === 'gradient' && <GradientProps {...props} />}
      {layer.type === 'image' && <ImageLayerProps {...props} />}
      {layer.type === 'text' && <TextLayerProps {...props} />}
    </div>
  );
};
