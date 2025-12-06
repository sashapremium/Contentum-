import { z } from 'zod';

export const UserSchema = z.object({
  role: z.enum(['SYSTEM', 'USER']),
});

export type User = z.infer<typeof UserSchema>;

export const UserMeResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: UserSchema,
});
