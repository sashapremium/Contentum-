import { api } from '@/lib/axios';
import { EventSchema, type Event } from '../types';

export async function fetchEvent(id: string): Promise<Event> {
  const response = await api.get(`/events/${id}/`);
  return EventSchema.parse(response.data);
}
