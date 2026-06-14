// Zod-схемы для запроса перегенерации: статус и тело запроса.
import { z } from 'zod';

export const StatusSchema = z.enum(['regeneration']);
export type Status = z.infer<typeof StatusSchema>;

export const RegenerateMessageRequestSchema = z.object({
  status: StatusSchema,
});
export type RegenerateMessageRequest = z.infer<
  typeof RegenerateMessageRequestSchema
>;
