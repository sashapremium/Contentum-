import { api } from '@/lib/axios';
import {
  type RegisterRequest,
  RegisterResponseSchema,
} from '../types/auth.types';

export async function registerRequest(payload: RegisterRequest) {
  const response = await api.post('/users/', payload);
  return RegisterResponseSchema.parse(response.data);
}
