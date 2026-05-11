import { useEffect, useReducer, useState } from 'react';
import { BACKEND_URL } from '@/app/router/routes';
import type { Template, TemplateLayer } from '../../types';

// ─── Extended layer union (editor adds background/rect/color_tint) ────────────

export type AnyLayer = TemplateLayer;

// ─── Editor-only wrapper for each layer (adds stable _id) ─────────────────────

export interface EditorEntry {
  _id: string;
  layer: AnyLayer;
}

// ─── Asset types ──────────────────────────────────────────────────────────────

export interface FontEntry {
  key: string;
  file: string;
  family: string;
  pendingFile?: File;
  objectUrl?: string;
}

export interface ImageAsset {
  path: string;
  pendingFile?: File;
  previewUrl?: string;
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface EditorState {
  templateId: string;
  name: string;
  family: string;
  canvas: { width: number; height: number };
  palette: Record<string, string>;
  fonts: FontEntry[];
  imageAssets: ImageAsset[];
  entries: EditorEntry[];
  selectedId: string | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type EditorAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_FAMILY'; family: string }
  | { type: 'SET_CANVAS_SIZE'; width: number; height: number }
  | { type: 'ADD_ENTRY'; entry: EditorEntry }
  | { type: 'REMOVE_ENTRY'; id: string }
  | { type: 'UPDATE_ENTRY'; id: string; layer: AnyLayer }
  | { type: 'UPDATE_BOX'; id: string; box: [number, number, number, number] }
  | { type: 'MOVE_ENTRY'; fromIndex: number; toIndex: number }
  | { type: 'SELECT'; id: string | null }
  | { type: 'ADD_FONT'; font: FontEntry }
  | { type: 'REMOVE_FONT'; key: string }
  | { type: 'ADD_IMAGE_ASSET'; asset: ImageAsset }
  | { type: 'REMOVE_IMAGE_ASSET'; path: string }
  | { type: 'SET_PALETTE'; palette: Record<string, string> };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name };
    case 'SET_FAMILY':
      return { ...state, family: action.family };
    case 'SET_CANVAS_SIZE':
      return {
        ...state,
        canvas: { width: action.width, height: action.height },
      };
    case 'ADD_ENTRY':
      return {
        ...state,
        entries: [...state.entries, action.entry],
        selectedId: action.entry._id,
      };
    case 'REMOVE_ENTRY': {
      const next = state.entries.filter((e) => e._id !== action.id);
      return {
        ...state,
        entries: next,
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
    }
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e._id === action.id ? { ...e, layer: action.layer } : e,
        ),
      };
    case 'UPDATE_BOX':
      return {
        ...state,
        entries: state.entries.map((e) => {
          if (e._id !== action.id || !('box' in e.layer)) return e;
          return { ...e, layer: { ...e.layer, box: action.box } as AnyLayer };
        }),
      };
    case 'MOVE_ENTRY': {
      const arr = [...state.entries];
      const [item] = arr.splice(action.fromIndex, 1);
      arr.splice(action.toIndex, 0, item);
      return { ...state, entries: arr };
    }
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'ADD_FONT':
      return { ...state, fonts: [...state.fonts, action.font] };
    case 'REMOVE_FONT':
      return {
        ...state,
        fonts: state.fonts.filter((f) => f.key !== action.key),
        entries: state.entries.map((e) => {
          if (e.layer.type === 'text' && e.layer.font === action.key) {
            return { ...e, layer: { ...e.layer, font: undefined } as AnyLayer };
          }
          return e;
        }),
      };
    case 'ADD_IMAGE_ASSET':
      return { ...state, imageAssets: [...state.imageAssets, action.asset] };
    case 'REMOVE_IMAGE_ASSET':
      return {
        ...state,
        imageAssets: state.imageAssets.filter((a) => a.path !== action.path),
        entries: state.entries.map((e) => {
          if (e.layer.type === 'image' && e.layer.file === action.path) {
            return { ...e, layer: { ...e.layer, file: '' } as AnyLayer };
          }
          return e;
        }),
      };
    case 'SET_PALETTE':
      return { ...state, palette: action.palette };
    default:
      return state;
  }
}

// ─── Initial state builders ───────────────────────────────────────────────────

function makeId(): string {
  return crypto.randomUUID();
}

function templateToState(template: Template, assetBaseUrl?: string): EditorState {
  const fonts: FontEntry[] = Object.entries(template.fonts ?? {}).map(
    ([key, f]) => ({
      key,
      file: f.file,
      family: f.family,
      objectUrl: assetBaseUrl ? `${assetBaseUrl}/${f.file}` : undefined,
    }),
  );

  const entries: EditorEntry[] = template.layers.map((layer) => ({
    _id: makeId(),
    layer,
  }));

  // Pre-populate image assets from image layers so the canvas can show them
  const imageAssets: ImageAsset[] = assetBaseUrl
    ? template.layers
        .filter((l): l is Extract<typeof l, { type: 'image' }> => l.type === 'image' && !!l.file)
        .map((l) => ({
          path: l.file,
          previewUrl: `${assetBaseUrl}/${l.file}`,
        }))
    : [];

  return {
    templateId: template.id,
    name: template.name,
    family: template.family ?? 'layout',
    canvas: template.canvas,
    palette: template.palette ?? {},
    fonts,
    imageAssets,
    entries,
    selectedId: null,
  };
}

function emptyState(): EditorState {
  return {
    templateId: '',
    name: 'Новый шаблон',
    family: 'photo_overlay',
    canvas: { width: 1080, height: 1080 },
    palette: {},
    fonts: [],
    imageAssets: [],
    entries: [],
    selectedId: null,
  };
}

// ─── Serialization: state → Template JSON ─────────────────────────────────────

export function stateToTemplate(state: EditorState): Template {
  const fonts: Record<string, { file: string; family: string }> = {};
  for (const f of state.fonts) {
    fonts[f.key] = { file: f.file, family: f.family };
  }

  return {
    id: state.templateId || `template_${Date.now()}`,
    name: state.name,
    family: state.family || undefined,
    canvas: state.canvas,
    palette: Object.keys(state.palette).length > 0 ? state.palette : undefined,
    fonts: Object.keys(fonts).length > 0 ? fonts : undefined,
    layers: state.entries.map((e) => {
      const layer = e.layer;
      // Backend heuristic: editable = name is set AND defaultText is empty.
      // Strip defaultText from editable text layers so the backend correctly
      // marks them as user-input fields regardless of the preview placeholder.
      if (layer.type === 'text' && layer.editable) {
        return { ...layer, defaultText: '' };
      }
      return layer;
    }),
  };
}

export function stateToPendingAssets(state: EditorState): Record<string, File> {
  const assets: Record<string, File> = {};
  for (const f of state.fonts) {
    if (f.pendingFile) assets[f.file] = f.pendingFile;
  }
  for (const img of state.imageAssets) {
    if (img.pendingFile) assets[img.path] = img.pendingFile;
  }
  return assets;
}

// ─── Public hook helpers ──────────────────────────────────────────────────────

export function makeEntry(layer: AnyLayer): EditorEntry {
  return { _id: makeId(), layer };
}

// ─── History ──────────────────────────────────────────────────────────────────

const MAX_HISTORY = 50;

// SELECT only changes which layer is highlighted — not worth polluting history
const NON_UNDOABLE = new Set<EditorAction['type']>(['SELECT']);

export type HistoryAction = EditorAction | { type: 'UNDO' } | { type: 'REDO' };

interface HistoryState {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  if (action.type === 'UNDO') {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: { ...previous, selectedId: state.present.selectedId },
      future: [state.present, ...state.future],
    };
  }

  if (action.type === 'REDO') {
    if (state.future.length === 0) return state;
    const [next, ...rest] = state.future;
    return {
      past: [...state.past, state.present].slice(-MAX_HISTORY),
      present: { ...next, selectedId: state.present.selectedId },
      future: rest,
    };
  }

  const next = reducer(state.present, action as EditorAction);

  console.group(`[Editor] ${action.type}`);
  console.log('action', action);
  console.log('prev', state.present.entries);
  console.log('next', next.entries);
  console.groupEnd();

  if (NON_UNDOABLE.has((action as EditorAction).type)) {
    return { ...state, present: next };
  }

  return {
    past: [...state.past, state.present].slice(-MAX_HISTORY),
    present: next,
    future: [],
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEditorState(initialTemplate?: Template, theatreId?: number) {
  const assetBaseUrl =
    initialTemplate && theatreId
      ? `${BACKEND_URL}/media/brandbooks/${theatreId}/${initialTemplate.id}`
      : undefined;

  const init = initialTemplate
    ? templateToState(initialTemplate, assetBaseUrl)
    : emptyState();

  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: init,
    future: [],
  });

  // Track when remote fonts finish loading so FabricCanvas re-renders text layers
  const [fontsLoadedAt, setFontsLoadedAt] = useState(0);

  useEffect(() => {
    if (!assetBaseUrl || !initialTemplate?.fonts) return;
    const loadFont = async (family: string, url: string) => {
      try {
        const buf = await fetch(url).then((r) => r.arrayBuffer());
        const loaded = await new FontFace(family, buf).load();
        document.fonts.add(loaded);
      } catch (err) {
        console.warn('[Editor] Font load failed:', url, err);
      }
    };
    const promises = Object.values(initialTemplate.fonts).map((f) =>
      loadFont(f.family, `${assetBaseUrl}/${f.file}`),
    );
    Promise.all(promises).then(() => setFontsLoadedAt(Date.now()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [
    history.present,
    dispatch,
    { canUndo: history.past.length > 0, canRedo: history.future.length > 0 },
    fontsLoadedAt,
  ] as const;
}
