import { z } from 'zod';

export const PhotoTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  family: z.string().min(1),
  preview: z.string().min(1),
});
export type PhotoTemplate = z.infer<typeof PhotoTemplateSchema>;

export const PhotoTheatreSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
});
export type PhotoTheatre = z.infer<typeof PhotoTheatreSchema>;

export const PhotoBrandbookSchema = z.object({
  theatreId: z.number().int(),
  theatreName: z.string().min(1),
  templates: z.array(PhotoTemplateSchema),
});
export type PhotoBrandbook = z.infer<typeof PhotoBrandbookSchema>;

export const PhotoSessionListItemSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastPreview: z.string().min(1).nullable(),
  variantsCount: z.number().int().nonnegative(),
});
export type PhotoSessionListItem = z.infer<typeof PhotoSessionListItemSchema>;

export const PhotoSessionsListResponseSchema = z.object({
  sessions: z.array(PhotoSessionListItemSchema),
  brandbooks: z.array(PhotoBrandbookSchema),
  theatres: z.array(PhotoTheatreSchema),
});
export type PhotoSessionsListResponse = z.infer<
  typeof PhotoSessionsListResponseSchema
>;

export const PhotoSessionCreateSchema = z.object({
  theatreId: z.number().int(),
  templateId: z.string().min(1),
});
export type PhotoSessionCreateRequest = z.infer<
  typeof PhotoSessionCreateSchema
>;

export const PhotoSessionCreateResponseSchema = z.object({
  sessionId: z.uuid(),
  title: z.string().min(1),
  theatreId: z.number().int(),
  theatreName: z.string().min(1),
  templateId: z.string().min(1),
  templateName: z.string().min(1),
  templateFamily: z.string().min(1),
});
export type PhotoSessionCreateResponse = z.infer<
  typeof PhotoSessionCreateResponseSchema
>;

export const PhotoInputTextSchema = z.object({
  key: z.string().min(1),
  label: z.string(),
  required: z.boolean(),
  maxLength: z.number().int().positive(),
});
export type PhotoInputText = z.infer<typeof PhotoInputTextSchema>;

export const PhotoInputImageSchema = z.object({
  key: z.string().min(1),
  label: z.string(),
  required: z.boolean(),
  crop: z.string(),
  gravity: z.string(),
});
export type PhotoInputImage = z.infer<typeof PhotoInputImageSchema>;

export const PhotoInputSchemaSchema = z.object({
  texts: z.array(PhotoInputTextSchema),
  images: z.array(PhotoInputImageSchema),
});
export type PhotoInputSchema = z.infer<typeof PhotoInputSchemaSchema>;

export const PhotoSessionHistoryItemSchema = z.object({
  variantNumber: z.number().int().positive(),
  mainText: z.string(),
  texts: z.record(z.string(), z.string()),
  templateId: z.string().min(1),
  resultWebp: z.string().min(1),
  resultPng: z.string().min(1),
  sourceImageUrl: z.string().min(1),
  images: z.record(z.string(), z.string()),
  createdAt: z.string(),
});

export type PhotoSessionHistoryItem = z.infer<
  typeof PhotoSessionHistoryItemSchema
>;

export const PhotoSessionSchema = z.object({
  sessionId: z.uuid(),
  title: z.string().min(1),
  theatreId: z.number().int(),
  theatreName: z.string().optional(),
  templateId: z.string().min(1),
  templateName: z.string().min(1),
  templateFamily: z.string().min(1),
  texts: z.record(z.string(), z.string()),
  images: z.record(z.string(), z.string()),
  inputSchema: PhotoInputSchemaSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  history: z.array(PhotoSessionHistoryItemSchema),
});

export type PhotoSession = z.infer<typeof PhotoSessionSchema>;

export const PhotoSessionRenameSchema = z.object({
  title: z.string().min(1),
});
export type PhotoSessionRenameRequest = z.infer<
  typeof PhotoSessionRenameSchema
>;

export const PhotoSessionGenerateSchema = z.object({
  texts: z.record(z.string(), z.string()),
  images: z.record(z.string(), z.string()).optional(),
  templateId: z.string().min(1).optional(),
});
export type PhotoSessionGenerateRequest = z.infer<
  typeof PhotoSessionGenerateSchema
>;

export const PhotoSessionUpdateSchema = z.union([
  PhotoSessionRenameSchema,
  PhotoSessionGenerateSchema,
]);
export type PhotoSessionUpdateRequest = z.infer<
  typeof PhotoSessionUpdateSchema
>;

export const PhotoSessionRenameResponseSchema = z.object({
  sessionId: z.uuid(),
  title: z.string().min(1),
});
export type PhotoSessionRenameResponse = z.infer<
  typeof PhotoSessionRenameResponseSchema
>;

export const PhotoSessionGenerateResponseSchema = z.object({
  versionNumber: z.number().int().positive(),
  mainText: z.string(),
  templateId: z.string().min(1),
  resultWebp: z.string().min(1),
  resultPng: z.string().min(1),
});
export type PhotoSessionGenerateResponse = z.infer<
  typeof PhotoSessionGenerateResponseSchema
>;

export const PhotoSessionUpdateResponseSchema = z.union([
  PhotoSessionRenameResponseSchema,
  PhotoSessionGenerateResponseSchema,
]);
export type PhotoSessionUpdateResponse = z.infer<
  typeof PhotoSessionUpdateResponseSchema
>;

export const PhotoSessionUploadResponseSchema = z.object({
  fileId: z.string().min(1),
  relativePath: z.string().min(1),
  url: z.string().min(1),
});
export type PhotoSessionUploadResponse = z.infer<
  typeof PhotoSessionUploadResponseSchema
>;
