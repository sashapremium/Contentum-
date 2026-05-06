import { api } from '@/lib/axios';
import {
  type Theatre,
  TheatreSchema,
  type TheatreListResponse,
  TheatreListResponseSchema,
  type TheatreCreateRequest,
  type TheatreDeleteResponse,
  TheatreDeleteResponseSchema,
} from '../types';

export async function fetchTheatres(): Promise<TheatreListResponse> {
  const response = await api.get('/theatres/');
  return TheatreListResponseSchema.parse(response.data);
}

export async function createTheatre(payload: TheatreCreateRequest): Promise<Theatre> {
  const response = await api.post('/theatres/', payload);
  return TheatreSchema.parse(response.data);
}

export async function fetchTheatre(id: number): Promise<Theatre> {
  const response = await api.get(`/theatres/${id}/`);
  return TheatreSchema.parse(response.data);
}

export async function updateTheatre(id: number, payload: TheatreCreateRequest): Promise<Theatre> {
  const response = await api.patch(`/theatres/${id}/`, payload);
  return TheatreSchema.parse(response.data);
}

export async function deleteTheatre(id: number): Promise<TheatreDeleteResponse> {
  const response = await api.delete(`/theatres/${id}/`);
  return TheatreDeleteResponseSchema.parse(response.data);
}
