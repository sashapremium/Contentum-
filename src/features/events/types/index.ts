import { z } from 'zod';

export const EventSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  genre: z.string(),
  datetime: z.string(),
  place: z.string(),
  eventType: z.string(),
  ageLimit: z.string(),
});
export type Event = z.infer<typeof EventSchema>;
