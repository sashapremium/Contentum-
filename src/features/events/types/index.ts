import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string(),
  type: z.string(),
  payload: z.any(),
});
export type Event = z.infer<typeof EventSchema>;
