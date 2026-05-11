import { useEffect, useRef } from 'react';
import { Canvas, type FabricObject } from 'fabric';

import type { EditorEntry, FontEntry, ImageAsset } from './useEditorState';
import {
  reconcileCanvas,
  loadImageAsset,
  fabricToBox,
  getEntryId,
} from './layerFabricSync';

const MAX_DISPLAY_PX = 560;

interface FabricCanvasProps {
  canvasSize: { width: number; height: number };
  entries: EditorEntry[];
  fonts: FontEntry[];
  imageAssets: ImageAsset[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMoveResize: (id: string, box: [number, number, number, number]) => void;
}

export const FabricCanvas = ({
  canvasSize,
  entries,
  fonts,
  imageAssets,
  selectedId,
  onSelect,
  onMoveResize,
}: FabricCanvasProps) => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const objectMapRef = useRef<Map<string, FabricObject>>(new Map());
  // Prevent reconciliation loop when Fabric fires and we update React state
  const fromFabricRef = useRef(false);
  // Always-current ref so the canvas event handler never holds a stale closure
  const onMoveResizeRef = useRef(onMoveResize);
  useEffect(() => { onMoveResizeRef.current = onMoveResize; });
  // Boxes dragged but not yet dispatched (debounce window) — reconcile skips their position
  const pendingBoxesRef = useRef<Map<string, [number, number, number, number]>>(new Map());
  const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const { width: canvasW, height: canvasH } = canvasSize;
  const scale = Math.min(MAX_DISPLAY_PX / canvasW, MAX_DISPLAY_PX / canvasH, 1);
  const displayW = Math.round(canvasW * scale);
  const displayH = Math.round(canvasH * scale);

  // ── Init / destroy canvas ────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasElRef.current) return;

    const fc = new Canvas(canvasElRef.current, {
      width: displayW,
      height: displayH,
      selection: true,
      backgroundColor: '#f0f0f0',
    });
    fc.setZoom(scale);
    fabricRef.current = fc;
    objectMapRef.current = new Map();

    fc.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      const id = obj ? getEntryId(obj) : null;
      if (id) onSelect(id);
    });
    fc.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      const id = obj ? getEntryId(obj) : null;
      if (id) onSelect(id);
    });
    fc.on('selection:cleared', () => {
      onSelect(null);
    });
    fc.on('object:modified', (e) => {
      const obj = e.target;
      if (!obj) return;
      const id = getEntryId(obj);
      if (!id) return;
      const box = fabricToBox(obj);

      // Cancel any existing debounce timer for this object
      const existing = debounceTimersRef.current.get(id);
      if (existing) clearTimeout(existing);

      // Hold the box so reconcile won't snap it back during the debounce window
      pendingBoxesRef.current.set(id, box);

      const timer = setTimeout(() => {
        pendingBoxesRef.current.delete(id);
        debounceTimersRef.current.delete(id);
        fromFabricRef.current = true;
        onMoveResizeRef.current(id, box);
      }, 1000);
      debounceTimersRef.current.set(id, timer);
    });

    return () => {
      fc.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasW, canvasH]); // Re-init when canvas size changes

  // ── Reconcile entries → canvas objects ───────────────────────────────────────
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    if (fromFabricRef.current) {
      fromFabricRef.current = false;
      return;
    }

    reconcileCanvas(fc, objectMapRef.current, entries, fonts, pendingBoxesRef.current);

    // Load real images asynchronously for image-type layers
    for (const entry of entries) {
      if (entry.layer.type === 'image') {
        loadImageAsset(fc, objectMapRef.current, entry, imageAssets, (id, naturalBox) => {
          // Sync state box to the image's natural pixel dimensions so
          // updateFabricObject can compute scaleX/Y correctly on every reconcile.
          onMoveResizeRef.current(id, naturalBox);
        });
      }
    }
  }, [entries, fonts, imageAssets, canvasW, canvasH]);

  // ── Sync external selectedId → canvas selection ──────────────────────────────
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    const activeObj = fc.getActiveObject();
    const activeId = activeObj ? getEntryId(activeObj) : null;
    if (activeId === selectedId) return;

    if (!selectedId) {
      fc.discardActiveObject();
      fc.renderAll();
      return;
    }
    const obj = objectMapRef.current.get(selectedId);
    if (obj && obj.selectable) {
      fc.setActiveObject(obj);
      fc.renderAll();
    }
  }, [selectedId]);

  return (
    <div
      className="overflow-hidden rounded border border-border bg-[#e8e8e8] shadow-inner"
      style={{ width: displayW, height: displayH }}
    >
      <canvas ref={canvasElRef} />
    </div>
  );
};
