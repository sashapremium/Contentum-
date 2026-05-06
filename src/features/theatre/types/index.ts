import { z } from 'zod';

export const TheatreSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  address: z.string().min(1),
  createdAt: z.string(),
  hasBrandbook: z.boolean(),
});
export type Theatre = z.infer<typeof TheatreSchema>;

export const TheatreListResponseSchema = z.object({
  theatres: z.array(TheatreSchema),
});
export type TheatreListResponse = z.infer<typeof TheatreListResponseSchema>;

export const TheatreCreateRequestSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
});
export type TheatreCreateRequest = z.infer<typeof TheatreCreateRequestSchema>;

export const TheatreDeleteResponseSchema = z.object({
  deleted: z.literal(true),
  id: z.number().int(),
  sessionsDeleted: z.number().int(),
});
export type TheatreDeleteResponse = z.infer<typeof TheatreDeleteResponseSchema>;
