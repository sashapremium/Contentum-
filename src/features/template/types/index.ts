// Zod-схемы для шаблонов.
// TemplateLayer - discriminated union по type: photo, gradient, image, text.
// box - tuple [x, y, width, height] в пикселях холста.
// TemplateFonts - Record<key, {file, family}> для загрузки шрифтов.
// TemplateInputSchema - описание полей ввода для фото-сессий, генерируется из photo/text слоёв.

import { z } from 'zod';

export const TemplateCanvasSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type TemplateCanvas = z.infer<typeof TemplateCanvasSchema>;

export const TemplatePaletteSchema = z.record(z.string(), z.string());
export type TemplatePalette = z.infer<typeof TemplatePaletteSchema>;

export const TemplateFontEntrySchema = z.object({
  file: z.string().min(1),
  family: z.string().min(1),
});
export type TemplateFontEntry = z.infer<typeof TemplateFontEntrySchema>;

export const TemplateFontsSchema = z.record(
  z.string(),
  TemplateFontEntrySchema,
);
export type TemplateFonts = z.infer<typeof TemplateFontsSchema>;

export const TemplateBoxSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);
export type TemplateBox = z.infer<typeof TemplateBoxSchema>;

export const TemplatePhotoLayerSchema = z.object({
  type: z.literal('photo'),
  name: z.string().min(1),
  slot: z.string().optional(),
  label: z.string().optional(),
  box: TemplateBoxSchema,
  crop: z.string().optional(),
  gravity: z.string().optional(),
  required: z.boolean().optional(),
});
export type TemplatePhotoLayer = z.infer<typeof TemplatePhotoLayerSchema>;

export const TemplateGradientLayerSchema = z.object({
  type: z.literal('gradient'),
  box: TemplateBoxSchema,
  colorFrom: z.string().min(1),
  colorTo: z.string().min(1),
  direction: z.string().min(1),
  opacity: z.number().min(0).max(1).optional(),
});
export type TemplateGradientLayer = z.infer<typeof TemplateGradientLayerSchema>;

export const TemplateImageLayerSchema = z.object({
  type: z.literal('image'),
  file: z.string().min(1),
  box: TemplateBoxSchema,
  align: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
  tintColor: z.string().optional(),
});
export type TemplateImageLayer = z.infer<typeof TemplateImageLayerSchema>;

export const TemplateTextLayerSchema = z.object({
  type: z.literal('text'),
  name: z.string().min(1),
  editable: z.boolean().optional(),
  label: z.string().optional(),
  box: TemplateBoxSchema,
  font: z.string().optional(),
  color: z.string().optional(),
  fontSize: z.tuple([z.number(), z.number()]).optional(),
  maxLength: z.number().int().positive().optional(),
  maxLines: z.number().int().positive().optional(),
  lineSpacing: z.number().optional(),
  align: z.string().optional(),
  verticalAlign: z.string().optional(),
  overflow: z.string().optional(),
  defaultText: z.string().optional(),
  required: z.boolean().optional(),
});
export type TemplateTextLayer = z.infer<typeof TemplateTextLayerSchema>;

export const TemplateLayerSchema = z.discriminatedUnion('type', [
  TemplatePhotoLayerSchema,
  TemplateGradientLayerSchema,
  TemplateImageLayerSchema,
  TemplateTextLayerSchema,
]);
export type TemplateLayer = z.infer<typeof TemplateLayerSchema>;

export const TemplateInputTextSchema = z.object({
  key: z.string().min(1),
  label: z.string(),
  required: z.boolean(),
  maxLength: z.number().int().positive(),
});
export type TemplateInputText = z.infer<typeof TemplateInputTextSchema>;

export const TemplateInputImageSchema = z.object({
  key: z.string().min(1),
  label: z.string(),
  required: z.boolean(),
  crop: z.string(),
  gravity: z.string(),
});
export type TemplateInputImage = z.infer<typeof TemplateInputImageSchema>;

export const TemplateInputSchemaSchema = z.object({
  texts: z.array(TemplateInputTextSchema),
  images: z.array(TemplateInputImageSchema),
});
export type TemplateInputSchema = z.infer<typeof TemplateInputSchemaSchema>;

export const TemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  family: z.string().optional(),
  canvas: TemplateCanvasSchema,
  palette: TemplatePaletteSchema.optional(),
  fonts: TemplateFontsSchema.optional(),
  layers: z.array(TemplateLayerSchema),
  preview: z.string().optional(),
  inputSchema: TemplateInputSchemaSchema.optional(),
});
export type Template = z.infer<typeof TemplateSchema>;

export const TemplateListResponseSchema = z.array(TemplateSchema);
export type TemplateListResponse = z.infer<typeof TemplateListResponseSchema>;

export const TemplateDeleteResponseSchema = z.object({
  deleted: z.literal(true),
  templateId: z.string().min(1),
});
export type TemplateDeleteResponse = z.infer<
  typeof TemplateDeleteResponseSchema
>;
