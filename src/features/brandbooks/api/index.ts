import { api } from '@/lib/axios';
import {
  type Brandbook,
  BrandbookSchema,
  type BrandbookDeleteResponse,
  BrandbookDeleteResponseSchema,
} from '../types';

export async function fetchBrandbook(theatreId: number): Promise<Brandbook> {
  const response = await api.get(`/theatres/${theatreId}/brandbook/`);
  return BrandbookSchema.parse(response.data);
}

export async function deleteBrandbook(theatreId: number): Promise<BrandbookDeleteResponse> {
  const response = await api.delete(`/theatres/${theatreId}/brandbook/`);
  return BrandbookDeleteResponseSchema.parse(response.data);
}
