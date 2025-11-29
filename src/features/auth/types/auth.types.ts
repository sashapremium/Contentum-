import { ZOD_FIELDS } from '@/lib/zodFieldMapper';
import { z } from 'zod';

export const LoginUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  fullName: ZOD_FIELDS.fullName,
  role: z.enum(['EMPLOYEE']),
});

export const LoginRequestSchema = z.object({
  email: z.email().min(1).max(254),
  password: ZOD_FIELDS.password,
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  refresh: z.string().min(1),
  access: z.string().min(1),
  user: LoginUserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RefreshRequestSchema = z.object({
  refresh: z.string().min(1),
});

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;

export const RefreshResponseSchema = z.object({
  refresh: z.string().min(1),
  access: z.string().min(1),
});

export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

export const RegisterRequestSchema = z
  .object({
    email: z.email().min(1).max(254),
    fullName: ZOD_FIELDS.fullName,
    password: ZOD_FIELDS.password,
    passwordConfirm: ZOD_FIELDS.password,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  });

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
