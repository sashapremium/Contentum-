import { z } from 'zod';

export const BrandbookTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  family: z.string().min(1),
  preview: z.string().min(1),
  dynamicTextCount: z.number().int().nonnegative(),
  dynamicImageCount: z.number().int().nonnegative(),
});
export type BrandbookTemplate = z.infer<typeof BrandbookTemplateSchema>;

export const BrandbookSchema = z.object({
  theatreId: z.number().int(),
  theatreName: z.string().min(1),
  templates: z.array(BrandbookTemplateSchema),
});
export type Brandbook = z.infer<typeof BrandbookSchema>;

export const BrandbookListResponseSchema = z.array(BrandbookSchema);
export type BrandbookListResponse = z.infer<typeof BrandbookListResponseSchema>;
