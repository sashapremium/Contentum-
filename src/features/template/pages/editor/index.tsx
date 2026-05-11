import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Redo2, Undo2 } from 'lucide-react';

import { THEATRE } from '@/app/router/routes';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Error } from '@/components/shared/Error';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCreateTemplateMutation } from '../../queries/useCreateTemplateMutation';
import { useDeleteTemplateMutation } from '../../queries/useDeleteTemplateMutation';
import { useUpdateTemplateMutation } from '../../queries/useUpdateTemplateMutation';
import type { Template } from '../../types';
import { AssetManager } from './AssetManager';
import { CanvasSizeDialog } from './CanvasSizeDialog';
import { FabricCanvas } from './FabricCanvas';
import { LayerPanel } from './LayerPanel';
import { PropertiesPanel } from './PropertiesPanel';
import {
  makeEntry,
  stateToTemplate,
  stateToPendingAssets,
  useEditorState,
  type AnyLayer,
} from './useEditorState';

// ─── Shared editor UI ─────────────────────────────────────────────────────────

interface EditorPageProps {
  mode: 'create' | 'update';
  initialTemplate?: Template;
}

export const EditorPage = ({ mode, initialTemplate }: EditorPageProps) => {
  const navigate = useNavigate();
  const { theatreId, templateId } = useParams<{
    theatreId: string;
    templateId: string;
  }>();
  const parsedTheatreId = Number(theatreId);

  const [state, dispatch, { canUndo, canRedo }] =
    useEditorState(initialTemplate);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const createMutation = useCreateTemplateMutation();
  const updateMutation = useUpdateTemplateMutation();
  const deleteMutation = useDeleteTemplateMutation();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const isError = createMutation.isError || updateMutation.isError;

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        console.log('[Editor] hotkey UNDO');
        dispatch({ type: 'UNDO' });
      }
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        console.log('[Editor] hotkey REDO');
        dispatch({ type: 'REDO' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSave = () => {
    const manifest = stateToTemplate(state);
    const assets = stateToPendingAssets(state);
    const payload =
      Object.keys(assets).length > 0 ? { manifest, assets } : manifest;

    if (mode === 'create') {
      createMutation.mutate(
        { theatreId: parsedTheatreId, payload },
        { onSuccess: () => navigate(THEATRE) },
      );
    } else {
      updateMutation.mutate({
        theatreId: parsedTheatreId,
        templateId: templateId!,
        payload,
      });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(
      { theatreId: parsedTheatreId, templateId: templateId! },
      { onSuccess: () => navigate(THEATRE) },
    );
  };

  const handleAddLayer = (layer: AnyLayer) =>
    dispatch({ type: 'ADD_ENTRY', entry: makeEntry(layer) });
  const handleRemoveLayer = (id: string) =>
    dispatch({ type: 'REMOVE_ENTRY', id });
  const handleSelectLayer = (id: string | null) =>
    dispatch({ type: 'SELECT', id });
  const handleUpdateLayer = (id: string, layer: AnyLayer) =>
    dispatch({ type: 'UPDATE_ENTRY', id, layer });
  const handleReorderLayer = (fromIndex: number, toIndex: number) =>
    dispatch({ type: 'MOVE_ENTRY', fromIndex, toIndex });
  const handleMoveResize = (
    id: string,
    box: [number, number, number, number],
  ) => {
    dispatch({ type: 'UPDATE_BOX', id, box });
  };

  // ── Breadcrumbs ───────────────────────────────────────────────────────────

  const breadcrumbs = [
    { url: THEATRE, label: 'Управление учреждением' },
    {
      url: '#',
      label:
        mode === 'create'
          ? 'Создание шаблона'
          : (initialTemplate?.name ?? 'Шаблон'),
    },
  ];

  return (
    <PageWrapper wide header={<Breadcrumbs links={breadcrumbs} />}>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Название</Label>
          <Input
            value={state.name}
            onChange={(e) =>
              dispatch({ type: 'SET_NAME', name: e.target.value })
            }
            className="h-8 w-48 text-sm"
          />
        </div>

        <CanvasSizeDialog
          current={state.canvas}
          onApply={(w, h) =>
            dispatch({ type: 'SET_CANVAS_SIZE', width: w, height: h })
          }
        />

        <AssetManager
          fonts={state.fonts}
          imageAssets={state.imageAssets}
          entries={state.entries}
          onAddFont={(font) => dispatch({ type: 'ADD_FONT', font })}
          onRemoveFont={(key) => dispatch({ type: 'REMOVE_FONT', key })}
          onAddImage={(asset) => dispatch({ type: 'ADD_IMAGE_ASSET', asset })}
          onRemoveImage={(path) =>
            dispatch({ type: 'REMOVE_IMAGE_ASSET', path })
          }
        />

        {/* Undo / Redo */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canUndo}
            onClick={() => dispatch({ type: 'UNDO' })}
            title="Отменить (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canRedo}
            onClick={() => dispatch({ type: 'REDO' })}
            title="Повторить (Ctrl+X)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-auto flex gap-2">
          {mode === 'update' && (
            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => setDeleteOpen(true)}
            >
              Удалить
            </Button>
          )}
          <Button size="sm" disabled={isPending} onClick={handleSave}>
            {isPending
              ? 'Сохранение...'
              : mode === 'create'
                ? 'Создать'
                : 'Сохранить'}
          </Button>
        </div>
      </div>

      {isError && <Error description="Не удалось сохранить шаблон" />}

      {/* ── Main editor layout ───────────────────────────────────────────── */}
      <div className="flex gap-4" style={{ minHeight: 580 }}>
        {/* Layer panel */}
        <div className="w-52 shrink-0">
          <LayerPanel
            state={state}
            onAddLayer={handleAddLayer}
            onRemoveLayer={handleRemoveLayer}
            onSelectLayer={handleSelectLayer}
            onReorderLayer={handleReorderLayer}
          />
        </div>

        {/* Canvas */}
        <div className="flex flex-1 items-start justify-center overflow-auto pt-2">
          <FabricCanvas
            canvasSize={state.canvas}
            entries={state.entries}
            fonts={state.fonts}
            imageAssets={state.imageAssets}
            selectedId={state.selectedId}
            onSelect={handleSelectLayer}
            onMoveResize={handleMoveResize}
          />
        </div>

        {/* Properties panel */}
        <div className="w-64 shrink-0">
          <PropertiesPanel state={state} onUpdateLayer={handleUpdateLayer} />
        </div>
      </div>

      {mode === 'update' && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Удалить шаблон?"
          description="Это действие необратимо."
          confirmText="Удалить"
          onClickConfirm={handleDelete}
        />
      )}
    </PageWrapper>
  );
};
