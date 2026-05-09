import { Canvas, Gradient, Rect, Textbox, FabricImage, type FabricObject } from 'fabric';
import type { AnyLayer, EditorEntry, FontEntry, ImageAsset } from './useEditorState';

// ─── Custom data tag on Fabric objects ───────────────────────────────────────

interface FabricData {
  _id: string;
}

// Fabric v6 exposes `data` as `any`; cast through `unknown` to keep TS happy
function setData(obj: FabricObject, id: string) {
  (obj as unknown as { data: FabricData }).data = { _id: id };
}

export function getEntryId(obj: FabricObject): string | null {
  const d = (obj as unknown as { data?: FabricData }).data;
  return d?._id ?? null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function boxToProps(box: [number, number, number, number]) {
  return { left: box[0], top: box[1], width: box[2], height: box[3] };
}

export function fabricToBox(obj: FabricObject): [number, number, number, number] {
  return [
    Math.round(obj.left),
    Math.round(obj.top),
    Math.round(obj.width * obj.scaleX),
    Math.round(obj.height * obj.scaleY),
  ];
}

// ─── Gradient helpers ─────────────────────────────────────────────────────────

function makeLinearGradient(colorFrom: string, colorTo: string, height: number): Gradient<'linear'> {
  return new Gradient({
    type: 'linear',
    gradientUnits: 'pixels',
    coords: { x1: 0, y1: 0, x2: 0, y2: Math.max(height, 1) },
    colorStops: [
      { offset: 0, color: colorFrom },
      { offset: 1, color: colorTo },
    ],
  });
}

// ─── Common Fabric object options ─────────────────────────────────────────────

const HANDLE_OPTS = {
  cornerSize: 8,
  cornerStyle: 'circle' as const,
  transparentCorners: false,
};

// ─── Layer → Fabric object ─────────────────────────────────────────────────────

export function layerToFabricObject(
  entry: EditorEntry,
  canvasW: number,
  canvasH: number,
  fonts: FontEntry[],
): FabricObject | null {
  const { _id, layer } = entry;

  const make = (obj: FabricObject) => {
    setData(obj, _id);
    return obj;
  };

  switch (layer.type) {
    case 'background':
      return make(
        new Rect({
          ...HANDLE_OPTS,
          left: 0,
          top: 0,
          width: canvasW,
          height: canvasH,
          fill: layer.color,
          selectable: false,
          evented: false,
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
        }),
      );

    case 'rect':
      return make(
        new Rect({
          ...HANDLE_OPTS,
          ...boxToProps(layer.box),
          fill: layer.color,
          opacity: layer.opacity ?? 1,
        }),
      );

    case 'color_tint': {
      const box = layer.box ?? ([0, 0, canvasW, canvasH] as [number, number, number, number]);
      const locked = !layer.box;
      return make(
        new Rect({
          ...HANDLE_OPTS,
          left: box[0],
          top: box[1],
          width: box[2],
          height: box[3],
          fill: layer.color,
          selectable: !locked,
          evented: !locked,
          hasControls: !locked,
          lockMovementX: locked,
          lockMovementY: locked,
        }),
      );
    }

    case 'photo':
      return make(
        new Rect({
          ...HANDLE_OPTS,
          ...boxToProps(layer.box),
          fill: 'rgba(100,120,200,0.12)',
          stroke: '#6080c8',
          strokeWidth: 2,
          strokeDashArray: [8, 4],
        }),
      );

    case 'gradient': {
      const [x, y, w, h] = layer.box;
      return make(
        new Rect({
          ...HANDLE_OPTS,
          left: x,
          top: y,
          width: w,
          height: h,
          fill: makeLinearGradient(layer.colorFrom, layer.colorTo, h),
          opacity: layer.opacity ?? 1,
        }),
      );
    }

    case 'image':
      return make(
        new Rect({
          ...HANDLE_OPTS,
          ...boxToProps(layer.box),
          fill: 'rgba(200,150,50,0.12)',
          stroke: '#c89632',
          strokeWidth: 2,
          strokeDashArray: [8, 4],
        }),
      );

    case 'text': {
      const fontEntry = layer.font ? fonts.find((f) => f.key === layer.font) : null;
      const fontFamily = fontEntry?.family ?? 'Times New Roman';
      const fontSize = layer.fontSize ? layer.fontSize[1] : 32;
      const displayText = layer.defaultText || layer.name;
      return make(
        new Textbox(displayText, {
          ...HANDLE_OPTS,
          left: layer.box[0],
          top: layer.box[1],
          width: layer.box[2],
          height: layer.box[3],
          fontFamily,
          fontSize,
          fill: layer.color ?? '#000000',
          textAlign: (layer.align as 'left' | 'right' | 'center' | 'justify') ?? 'left',
          editable: false,
          splitByGrapheme: false,
        }),
      );
    }

    default:
      return null;
  }
}

// ─── Load real image into placeholder (async) ─────────────────────────────────

export async function loadImageAsset(
  canvas: Canvas,
  entry: EditorEntry,
  imageAssets: ImageAsset[],
): Promise<void> {
  if (entry.layer.type !== 'image') return;
  const { file, box, opacity } = entry.layer as Extract<AnyLayer, { type: 'image' }>;
  const asset = imageAssets.find((a) => a.path === file);
  if (!asset?.previewUrl) return;

  const placeholder = canvas.getObjects().find((o) => getEntryId(o) === entry._id);
  if (!placeholder) return;

  try {
    const imgObj = await FabricImage.fromURL(asset.previewUrl, { crossOrigin: 'anonymous' });
    imgObj.set({
      ...HANDLE_OPTS,
      left: box[0],
      top: box[1],
      scaleX: box[2] / imgObj.width,
      scaleY: box[3] / imgObj.height,
      opacity: opacity ?? 1,
    });
    setData(imgObj, entry._id);
    canvas.remove(placeholder);
    canvas.add(imgObj);
    canvas.renderAll();
  } catch {
    // keep placeholder on error
  }
}

// ─── Reconcile canvas with entries ────────────────────────────────────────────
// Simple strategy: clear canvas, re-add all objects in layer order.
// Called only when state changes from React (not from Fabric events).

export function reconcileCanvas(
  canvas: Canvas,
  objectMap: Map<string, FabricObject>,
  entries: EditorEntry[],
  canvasW: number,
  canvasH: number,
  fonts: FontEntry[],
): void {
  // Save which object was active
  const activeId = (() => {
    const active = canvas.getActiveObject();
    return active ? getEntryId(active) : null;
  })();

  canvas.discardActiveObject();

  // Remove objects no longer in entries
  const entryIds = new Set(entries.map((e) => e._id));
  for (const [id, obj] of objectMap) {
    if (!entryIds.has(id)) {
      canvas.remove(obj);
      objectMap.delete(id);
    }
  }

  // For each entry: add new or update existing; objects may change position in canvas._objects
  const newOrder: FabricObject[] = [];

  for (const entry of entries) {
    let obj = objectMap.get(entry._id);
    if (obj) {
      updateFabricObject(obj, entry.layer, canvasW, canvasH, fonts);
    } else {
      const created = layerToFabricObject(entry, canvasW, canvasH, fonts);
      if (created) {
        canvas.add(created);
        objectMap.set(entry._id, created);
        obj = created;
      }
    }
    if (obj) newOrder.push(obj);
  }

  // Re-sort canvas objects to match layer order
  const canvasObjects = canvas.getObjects();
  newOrder.forEach((obj, targetIdx) => {
    const currentIdx = canvasObjects.indexOf(obj);
    if (currentIdx !== targetIdx && currentIdx !== -1) {
      // Move by removing and re-inserting at the correct index
      const arr = canvas._objects as FabricObject[];
      arr.splice(currentIdx, 1);
      arr.splice(targetIdx, 0, obj);
    }
  });

  // Restore active selection
  if (activeId) {
    const obj = objectMap.get(activeId);
    if (obj && obj.selectable) {
      canvas.setActiveObject(obj);
    }
  }

  canvas.renderAll();
}

// ─── Update a Fabric object in-place ─────────────────────────────────────────

function updateFabricObject(
  obj: FabricObject,
  layer: AnyLayer,
  canvasW: number,
  canvasH: number,
  fonts: FontEntry[],
): void {
  switch (layer.type) {
    case 'background':
      obj.set({ fill: layer.color });
      break;

    case 'rect':
      obj.set({ ...boxToProps(layer.box), fill: layer.color, opacity: layer.opacity ?? 1 });
      obj.setCoords();
      break;

    case 'color_tint': {
      const box = layer.box ?? ([0, 0, canvasW, canvasH] as [number, number, number, number]);
      obj.set({ left: box[0], top: box[1], width: box[2], height: box[3], fill: layer.color });
      obj.setCoords();
      break;
    }

    case 'photo':
      obj.set(boxToProps(layer.box));
      obj.setCoords();
      break;

    case 'gradient': {
      const [x, y, w, h] = layer.box;
      obj.set({
        left: x,
        top: y,
        width: w,
        height: h,
        fill: makeLinearGradient(layer.colorFrom, layer.colorTo, h),
        opacity: layer.opacity ?? 1,
      });
      obj.setCoords();
      break;
    }

    case 'image':
      obj.set({ ...boxToProps(layer.box), opacity: layer.opacity ?? 1 });
      obj.setCoords();
      break;

    case 'text': {
      const fontEntry = layer.font ? fonts.find((f) => f.key === layer.font) : null;
      const fontFamily = fontEntry?.family ?? 'Times New Roman';
      const fontSize = layer.fontSize ? layer.fontSize[1] : 32;
      const displayText = layer.defaultText || layer.name;
      if (obj instanceof Textbox) {
        obj.set({
          ...boxToProps(layer.box),
          text: displayText,
          fontFamily,
          fontSize,
          fill: layer.color ?? '#000000',
          textAlign: (layer.align as 'left' | 'right' | 'center' | 'justify') ?? 'left',
        });
      }
      obj.setCoords();
      break;
    }
  }
}
