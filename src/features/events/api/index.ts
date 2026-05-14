import { api } from '@/lib/axios';
import {
  type Event,
  EventSchema,
  type EventListResponse,
  EventListResponseSchema,
  type EventCreateRequest,
  type EventUpdateRequest,
  type EventDeleteResponse,
  EventDeleteResponseSchema,
} from '../types';

export async function fetchEvents(): Promise<EventListResponse> {
  const response = await api.get('/events/');
  return EventListResponseSchema.parse(response.data);
}

export async function createEvent(payload: EventCreateRequest): Promise<Event> {
  const response = await api.post('/events/', payload);
  return EventSchema.parse(response.data);
}

export async function fetchEvent(id: string): Promise<Event> {
  const response = await api.get(`/events/${id}/`);
  return EventSchema.parse(response.data);
}

export async function updateEvent(id: number, payload: EventUpdateRequest): Promise<Event> {
  const response = await api.patch(`/events/${id}/`, payload);
  return EventSchema.parse(response.data);
}

export async function deleteEvent(id: number): Promise<EventDeleteResponse> {
  const response = await api.delete(`/events/${id}/`);
  return EventDeleteResponseSchema.parse(response.data);
}
