import { z } from 'zod';

export const EventSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1),
  description: z.string(),
  eventType: z.string(),
  ageLimit: z.string(),
  genre: z.string(),
  datetime: z.string(),
  place: z.string(),
});
export type Event = z.infer<typeof EventSchema>;

export const EventCreateMetaSchema = z.object({
  eventTypes: z.array(z.enum(['concert', 'performance', 'festival', 'show'])),
  ageLimits: z.array(z.enum(['0+', '6+', '12+', '16+', '18+'])),
});
export type EventCreateMeta = z.infer<typeof EventCreateMetaSchema>;

export const EventListResponseSchema = z.object({
  events: z.array(EventSchema),
  createMeta: EventCreateMetaSchema,
});
export type EventListResponse = z.infer<typeof EventListResponseSchema>;

export const EventCreateRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  eventType: z.string().min(1, 'Выберите тип мероприятия'),
  ageLimit: z.string().optional(),
  genre: z.string().optional(),
  datetime: z.string().min(1, 'Укажите дату и время'),
  place: z.string().optional(),
});
export type EventCreateRequest = z.infer<typeof EventCreateRequestSchema>;

export const EventUpdateRequestSchema = EventCreateRequestSchema.partial();
export type EventUpdateRequest = z.infer<typeof EventUpdateRequestSchema>;

export const EventDeleteResponseSchema = z.object({
  deleted: z.literal(true),
  id: z.number().int(),
});
export type EventDeleteResponse = z.infer<typeof EventDeleteResponseSchema>;
