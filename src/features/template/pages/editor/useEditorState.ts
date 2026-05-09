import { useReducer } from 'react';
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
      return { ...state, canvas: { width: action.width, height: action.height } };
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.entry], selectedId: action.entry._id };
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
      return { ...state, fonts: state.fonts.filter((f) => f.key !== action.key) };
    case 'ADD_IMAGE_ASSET':
      return { ...state, imageAssets: [...state.imageAssets, action.asset] };
    case 'REMOVE_IMAGE_ASSET':
      return { ...state, imageAssets: state.imageAssets.filter((a) => a.path !== action.path) };
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

function templateToState(template: Template): EditorState {
  const fonts: FontEntry[] = Object.entries(template.fonts ?? {}).map(([key, f]) => ({
    key,
    file: f.file,
    family: f.family,
  }));

  const entries: EditorEntry[] = template.layers.map((layer) => ({
    _id: makeId(),
    layer,
  }));

  return {
    templateId: template.id,
    name: template.name,
    family: template.family ?? 'layout',
    canvas: template.canvas,
    palette: template.palette ?? {},
    fonts,
    imageAssets: [],
    entries,
    selectedId: null,
  };
}

function emptyState(): EditorState {
  return {
    templateId: '',
    name: 'Новый шаблон',
    family: 'layout',
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
    layers: state.entries.map((e) => e.layer),
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEditorState(initialTemplate?: Template) {
  const init = initialTemplate ? templateToState(initialTemplate) : emptyState();
  return useReducer(reducer, init);
}
