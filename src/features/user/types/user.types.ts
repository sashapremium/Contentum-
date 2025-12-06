import { z } from 'zod';

export const UserSchema = z.object({
  role: z.enum(['EMPLOYEE', 'ADMIN']),
  isActive: z.boolean(),
  id: z.uuid(),
  fullName: z.string(),
  email: z.string(),
  dateJoined: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UserMeResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: UserSchema,
});
