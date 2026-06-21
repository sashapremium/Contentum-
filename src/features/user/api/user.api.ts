// Получение данных текущего пользователя

import { api } from '@/lib/axios';
import { UserMeResponseSchema, type User } from '../types/user.types';

export async function fetchUserMe(): Promise<User> {
  const res = await api.get('/users/me');

  const parsed = UserMeResponseSchema.parse(res.data);
  return parsed;
}
