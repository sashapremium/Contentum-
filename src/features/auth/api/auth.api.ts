// Запросы к бэкенду для аутентификации: вход, регистрация, обновление токенов.
import { api } from '@/lib/axios';
import {
  LoginResponseSchema,
  RefreshResponseSchema,
  type LoginRequest,
  type RefreshRequest,
  type RegisterRequest,
} from '../types/auth.types';

export async function loginRequest(payload: LoginRequest) {
  const response = await api.post('/auth/login', payload);
  return LoginResponseSchema.parse(response.data);
}

export async function refreshRequest(payload: RefreshRequest) {
  const response = await api.post('/auth/refresh', payload);
  return RefreshResponseSchema.parse(response.data);
}

export async function registerRequest(payload: RegisterRequest) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}
