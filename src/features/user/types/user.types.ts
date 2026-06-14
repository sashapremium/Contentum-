// Zod-схемы для пользователя: id, email, role (только 'user').

import { z } from 'zod';

export const UserIdSchema = z.number().int();
export type UserId = z.infer<typeof UserIdSchema>;

export const UserSchema = z.object({
  role: z.enum(['user']),
  id: UserIdSchema,
  email: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UserMeResponseSchema = UserSchema;
