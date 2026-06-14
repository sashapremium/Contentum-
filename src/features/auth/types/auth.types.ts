// Zod-схемы и типы для аутентификации: вход, регистрация, access/refresh токены.
import { ZOD_FIELDS } from '@/lib/zodFieldMapper';
import { z } from 'zod';

// Данные пользователя, возвращаемые при входе
export const LoginUserSchema = z.object({
  id: z.number(),
  email: z.email(),
  role: z.enum(['user']),
});

// Тело запроса и ответа для входа
export const LoginRequestSchema = z.object({
  email: z.email().min(1).max(254),
  password: ZOD_FIELDS.password,
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  refreshToken: z.string().min(1),
  accessToken: z.string().min(1),
  user: LoginUserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Тело запроса и ответа для обновления токенов
export const RefreshRequestSchema = z.object({
  refresh: z.string().min(1),
});

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;

export const RefreshResponseSchema = z.object({
  refresh: z.string().min(1),
  access: z.string().min(1),
});

export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

// Тело запроса для регистрации. Включает проверку совпадения паролей через refine
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
