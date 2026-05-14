import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router';
import { Redo2, Undo2 } from 'lucide-react';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Error } from '@/components/shared/Error';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
import { THEATRE_TITLE } from '@/app/router/routes';

// ─── Name form schema ─────────────────────────────────────────────────────────

const nameSchema = z.object({
  name: z.string().min(1, 'Название не может быть пустым'),
});
type NameForm = z.infer<typeof nameSchema>;

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

  const [state, rawDispatch, { canUndo, canRedo }, fontsLoadedAt] =
    useEditorState(initialTemplate, parsedTheatreId);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const nameForm = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: state.name },
  });

  // Keep form in sync when undo/redo changes the name
  useEffect(() => {
    nameForm.setValue('name', state.name, { shouldValidate: true });
  }, [state.name, nameForm]);

  const createMutation = useCreateTemplateMutation();
  const updateMutation = useUpdateTemplateMutation();
  const deleteMutation = useDeleteTemplateMutation();

  const createMutationRef = useRef(createMutation);
  const updateMutationRef = useRef(updateMutation);
  createMutationRef.current = createMutation;
  updateMutationRef.current = updateMutation;

  const dispatch: typeof rawDispatch = useCallback(
    (action) => {
      if (createMutationRef.current.isError) createMutationRef.current.reset();
      if (updateMutationRef.current.isError) updateMutationRef.current.reset();
      rawDispatch(action);
    },
    [rawDispatch],
  );

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
        { onSuccess: () => navigate(-1) },
      );
    } else {
      updateMutation.mutate(
        {
          theatreId: parsedTheatreId,
          templateId: templateId!,
          payload,
        },
        { onSuccess: () => navigate(-1) },
      );
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(
      { theatreId: parsedTheatreId, templateId: templateId! },
      { onSuccess: () => navigate(-1) },
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
    { onClick: () => navigate(-1), label: THEATRE_TITLE },
    {
      url: '#',
      label:
        mode === 'create'
          ? 'Создание шаблона'
          : (initialTemplate?.name ?? 'Шаблон'),
    },
  ];

  return (
    <PageWrapper size="wide" header={<Breadcrumbs links={breadcrumbs} />}>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <Form {...nameForm}>
          <FormField
            control={nameForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Название шаблона</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      dispatch({ type: 'SET_NAME', name: e.target.value });
                    }}
                    className="h-8 w-80 text-sm"
                    placeholder="Название шаблона"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </Form>
        <div className="mb-4 flex flex-wrap items-center gap-3 border-b pb-4">
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
      </div>

      {isError && (
        <div className="mb-4">
          <Error description="Не удалось сохранить шаблон" />
        </div>
      )}

      {/* ── Main editor layout ───────────────────────────────────────────── */}
      <div className="flex gap-4" style={{ minHeight: 580 }}>
        {/* Layer panel — fixed height so it never grows with PropertiesPanel */}
        <div className="w-72 shrink-0 self-start" style={{ height: 580 }}>
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
            fontsLoadedAt={fontsLoadedAt}
            onSelect={handleSelectLayer}
            onMoveResize={handleMoveResize}
          />
        </div>

        {/* Properties panel */}
        <div className="w-72 shrink-0">
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
