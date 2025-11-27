import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
  access: z.string().min(1),
  refresh: z.string().min(1),
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

export const RegisterRequestSchema = z.object({
  email: z.email().min(1).max(254),
  fullName: z.string().min(1).max(255),
  password: z.string().min(8),
  passwordConfirm: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const RegisterResponseSchema = z.object({
  email: z.email().min(1).max(254),
  fullName: z.string().min(1).max(255),
  password: z.string().min(8),
  passwordConfirm: z.string().min(1),
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
