import { z } from 'zod';

export const UserIdSchema = z.number().int();
export type UserId = z.infer<typeof UserIdSchema>;

export const UserSchema = z.object({
  // role: z.enum(['EMPLOYEE', 'ADMIN']),
  role: z.enum(['user']),
  id: UserIdSchema,
  // fullName: z.string(),
  email: z.string(),
  // dateJoined: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UserMeResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: UserSchema,
});
