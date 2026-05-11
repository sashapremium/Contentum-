import {
  Canvas,
  Gradient,
  Rect,
  Textbox,
  FabricImage,
  type FabricObject,
} from 'fabric';
import type {
  AnyLayer,
  EditorEntry,
  FontEntry,
  ImageAsset,
} from './useEditorState';

// ─── Custom data tag on Fabric objects ───────────────────────────────────────

interface FabricData {
  _id: string;
  loadedFile?: string; // tracks which file a FabricImage was loaded from
}

function setData(obj: FabricObject, id: string, loadedFile?: string) {
  (obj as unknown as { data: FabricData }).data = {
    _id: id,
    ...(loadedFile ? { loadedFile } : {}),
  };
}

export function getEntryId(obj: FabricObject): string | null {
  const d = (obj as unknown as { data?: FabricData }).data;
  return d?._id ?? null;
}

function getLoadedFile(obj: FabricObject): string | undefined {
  return (obj as unknown as { data?: FabricData }).data?.loadedFile;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function boxToProps(box: [number, number, number, number]) {
  return { left: box[0], top: box[1], width: box[2], height: box[3] };
}

export function fabricToBox(
  obj: FabricObject,
): [number, number, number, number] {
  return [
    Math.round(obj.left),
    Math.round(obj.top),
    Math.round(obj.width * obj.scaleX),
    Math.round(obj.height * obj.scaleY),
  ];
}

// ─── Gradient helper ──────────────────────────────────────────────────────────

function makeLinearGradient(
  colorFrom: string,
  colorTo: string,
  height: number,
): Gradient<'linear'> {
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

// ─── Common Fabric control style ──────────────────────────────────────────────

const HANDLE_OPTS = {
  cornerSize: 8,
  cornerStyle: 'circle' as const,
  transparentCorners: false,
};

// ─── Layer → Fabric object ────────────────────────────────────────────────────

export function layerToFabricObject(
  entry: EditorEntry,
  fonts: FontEntry[],
  placeholderStroke: string,
): FabricObject | null {
  const { _id, layer } = entry;

  const make = (obj: FabricObject) => {
    setData(obj, _id);
    return obj;
  };

  switch (layer.type) {
    case 'photo':
      return make(
        new Rect({
          ...HANDLE_OPTS,
          ...boxToProps(layer.box),
          fill: 'rgba(156,163,175,0.1)',
          stroke: placeholderStroke,
          borderColor: placeholderStroke,
          cornerColor: placeholderStroke,
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
          stroke: placeholderStroke,
          cornerColor: placeholderStroke,
          borderColor: placeholderStroke,
        }),
      );
    }

    case 'image':
      return make(
        new Rect({
          ...HANDLE_OPTS,
          ...boxToProps(layer.box),
          fill: 'rgba(156,163,175,0.1)',
          strokeWidth: 2,
          strokeDashArray: [8, 4],
          stroke: placeholderStroke,
          cornerColor: placeholderStroke,
          borderColor: placeholderStroke,
        }),
      );

    case 'text': {
      const fontEntry = layer.font
        ? fonts.find((f) => f.key === layer.font)
        : null;
      const fontFamily = fontEntry?.family ?? 'Times New Roman';
      const fontSize = layer.fontSize ? layer.fontSize[1] : 32;
      const displayText = layer.defaultText || layer.name;
      const isEditable = layer.editable === true;

      return make(
        new Textbox(displayText, {
          ...HANDLE_OPTS,
          left: layer.box[0],
          top: layer.box[1],
          width: layer.box[2],
          height: layer.box[3],
          fontFamily,
          fontSize,
          fill: isEditable ? '#51a2ff' : (layer.color ?? '#000000'),
          textAlign:
            (layer.align as 'left' | 'right' | 'center' | 'justify') ?? 'left',
          // Editable slots get a dashed blue border so designer sees it's a user-input field
          stroke: placeholderStroke,
          strokeWidth: isEditable ? 1 : 0,
          borderColor: placeholderStroke,
          cornerColor: placeholderStroke,
          strokeDashArray: isEditable ? [4, 4] : [],
          editable: false, // canvas editing off; value comes from PropertiesPanel
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
  objectMap: Map<string, FabricObject>,
  entry: EditorEntry,
  entries: EditorEntry[],
  imageAssets: ImageAsset[],
): Promise<void> {
  if (entry.layer.type !== 'image') return;
  const { file, box, opacity } = entry.layer as Extract<
    AnyLayer,
    { type: 'image' }
  >;

  if (!file) return;

  const asset = imageAssets.find((a) => a.path === file);
  if (!asset?.previewUrl) return;

  const current = objectMap.get(entry._id);
  if (current instanceof FabricImage && getLoadedFile(current) === file) return;

  const placeholder = canvas
    .getObjects()
    .find((o) => getEntryId(o) === entry._id);
  if (!placeholder) return;

  try {
    const imgObj = await FabricImage.fromURL(asset.previewUrl, {
      crossOrigin: 'anonymous',
    });
    const naturalW = imgObj.width;
    const naturalH = imgObj.height;

    // Scale to the existing box dimensions — do NOT override state with natural dims.
    imgObj.set({
      ...HANDLE_OPTS,
      left: box[0],
      top: box[1],
      scaleX: naturalW > 0 && box[2] > 0 ? box[2] / naturalW : 1,
      scaleY: naturalH > 0 && box[3] > 0 ? box[3] / naturalH : 1,
      opacity: opacity ?? 1,
    });
    setData(imgObj, entry._id, file);

    // Remove placeholder, add image, then move it to the correct z-position.
    const entryZ = entries.findIndex((e) => e._id === entry._id);
    canvas.remove(placeholder);
    canvas.add(imgObj); // adds at top, initialises canvas ref + coords
    if (entryZ >= 0) {
      const arr = canvas._objects as FabricObject[];
      const currentIdx = arr.indexOf(imgObj);
      if (currentIdx !== entryZ) {
        arr.splice(currentIdx, 1);
        arr.splice(entryZ, 0, imgObj);
      }
    }

    objectMap.set(entry._id, imgObj);
    canvas.renderAll();
  } catch {
    // keep placeholder on error
  }
}

// ─── Reconcile canvas with entries ────────────────────────────────────────────

export function reconcileCanvas(
  canvas: Canvas,
  objectMap: Map<string, FabricObject>,
  entries: EditorEntry[],
  fonts: FontEntry[],
  pendingBoxes?: ReadonlyMap<string, [number, number, number, number]>,
  placeholderStroke = '#9ca3af',
): void {
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

  const newOrder: FabricObject[] = [];

  for (const entry of entries) {
    let obj = objectMap.get(entry._id);

    // Image file was cleared or changed: drop the FabricImage so a fresh
    // placeholder rect is created below, then loadImageAsset reloads it.
    if (obj instanceof FabricImage && entry.layer.type === 'image') {
      const currentFile = (entry.layer as Extract<AnyLayer, { type: 'image' }>)
        .file;
      if (getLoadedFile(obj) !== currentFile) {
        canvas.remove(obj);
        objectMap.delete(entry._id);
        obj = undefined;
      }
    }

    if (obj) {
      updateFabricObject(
        obj,
        entry.layer,
        fonts,
        pendingBoxes?.has(entry._id) ?? false,
        placeholderStroke,
      );
    } else {
      const created = layerToFabricObject(entry, fonts, placeholderStroke);
      if (created) {
        canvas.add(created);
        objectMap.set(entry._id, created);
        obj = created;
      }
    }
    if (obj) newOrder.push(obj);
  }

  // Re-order canvas objects to match entries z-order.
  // Splice-based sort with a stale snapshot is buggy, so replace the array in-place.
  (canvas._objects as FabricObject[]).splice(
    0,
    canvas._objects.length,
    ...newOrder,
  );

  if (activeId) {
    const obj = objectMap.get(activeId);
    if (obj && obj.selectable) canvas.setActiveObject(obj);
  }

  canvas.renderAll();
}

// ─── Update a Fabric object in-place ─────────────────────────────────────────

function updateFabricObject(
  obj: FabricObject,
  layer: AnyLayer,
  fonts: FontEntry[],
  skipBox = false,
  placeholderStroke: string,
): void {
  const pos = skipBox ? {} : boxToProps(layer.box);

  switch (layer.type) {
    case 'photo':
      if (!skipBox) {
        obj.set(pos);
        obj.setCoords();
      }
      break;

    case 'gradient': {
      const [, , , h] = layer.box;
      obj.set({
        ...pos,
        fill: makeLinearGradient(layer.colorFrom, layer.colorTo, h),
        opacity: layer.opacity ?? 1,
      });
      if (!skipBox) obj.setCoords();
      break;
    }

    case 'image':
      if (obj instanceof FabricImage) {
        // FabricImage.width/height are the natural pixel dimensions.
        // Displayed size = naturalW * scaleX, so we derive scale from the box.
        if (!skipBox) {
          obj.set({
            left: layer.box[0],
            top: layer.box[1],
            scaleX: layer.box[2] / obj.width,
            scaleY: layer.box[3] / obj.height,
            opacity: layer.opacity ?? 1,
            stroke: placeholderStroke,
            cornerColor: placeholderStroke,
            borderColor: placeholderStroke,
          });
          obj.setCoords();
        } else {
          obj.set({ opacity: layer.opacity ?? 1 });
        }
      } else {
        // Placeholder rect — simple box update
        obj.set({ ...pos, opacity: layer.opacity ?? 1 });
        if (!skipBox) obj.setCoords();
      }
      break;

    case 'text': {
      const fontEntry = layer.font
        ? fonts.find((f) => f.key === layer.font)
        : null;
      const fontFamily = fontEntry?.family ?? 'Times New Roman';
      const fontSize = layer.fontSize ? layer.fontSize[1] : 32;
      const displayText = layer.defaultText || layer.name;
      const isEditable = layer.editable === true;

      if (obj instanceof Textbox) {
        obj.set({
          ...pos,
          text: displayText,
          fontFamily,
          fontSize,
          fill: isEditable ? '#51a2ff' : (layer.color ?? '#000000'),
          textAlign:
            (layer.align as 'left' | 'right' | 'center' | 'justify') ?? 'left',
          stroke: placeholderStroke,
          cornerColor: placeholderStroke,
          borderColor: placeholderStroke,
          strokeWidth: isEditable ? 1 : 0,
          strokeDashArray: isEditable ? [4, 4] : [],
        });
      }
      if (!skipBox) obj.setCoords();
      break;
    }
  }
}
