import { api } from '@/lib/axios';
import {
  type PhotoSession,
  PhotoSessionSchema,
  type PhotoSessionCreateRequest,
  type PhotoSessionCreateResponse,
  PhotoSessionCreateResponseSchema,
  type PhotoSessionRenameResponse,
  PhotoSessionRenameResponseSchema,
  type PhotoSessionGenerateResponse,
  PhotoSessionGenerateResponseSchema,
  type PhotoSessionUpdateRequest,
  type PhotoSessionUploadResponse,
  PhotoSessionUploadResponseSchema,
  type PhotoSessionsListResponse,
  PhotoSessionsListResponseSchema,
} from '../types/photos.types';

export interface PhotoSessionGenerateWithAssetsPayload {
  texts: Record<string, string>;
  assets: Record<string, File>;
  templateId?: string;
}

function buildGenerateFormData({
  texts,
  assets,
  templateId,
}: PhotoSessionGenerateWithAssetsPayload): FormData {
  const formData = new FormData();
  formData.append('texts', JSON.stringify(texts));
  if (templateId) {
    formData.append('templateId', templateId);
  }
  for (const [key, file] of Object.entries(assets)) {
    formData.append(key, file);
  }
  return formData;
}

export async function fetchPhotoSessions(): Promise<PhotoSessionsListResponse> {
  const response = await api.get('/photos/sessions/');
  return PhotoSessionsListResponseSchema.parse(response.data);
}

export async function createPhotoSession(
  payload: PhotoSessionCreateRequest,
): Promise<PhotoSessionCreateResponse> {
  const response = await api.post('/photos/sessions/', payload);
  return PhotoSessionCreateResponseSchema.parse(response.data);
}

export async function fetchPhotoSession(id: string): Promise<PhotoSession> {
  const response = await api.get(`/photos/sessions/${id}/`);
  return PhotoSessionSchema.parse(response.data);
}

export async function updatePhotoSession(
  id: string,
  payload: PhotoSessionUpdateRequest | PhotoSessionGenerateWithAssetsPayload,
): Promise<PhotoSessionRenameResponse | PhotoSessionGenerateResponse> {
  const body = 'assets' in payload ? buildGenerateFormData(payload) : payload;
  const response = await api.patch(`/photos/sessions/${id}/`, body);

  if ('versionNumber' in response.data) {
    return PhotoSessionGenerateResponseSchema.parse(response.data);
  }

  return PhotoSessionRenameResponseSchema.parse(response.data);
}

export async function deletePhotoSession(id: string): Promise<void> {
  await api.delete(`/photos/sessions/${id}/`);
}

export async function uploadPhotoSessionSourceImage(
  id: string,
  file: File,
): Promise<PhotoSessionUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/photos/sessions/${id}/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return PhotoSessionUploadResponseSchema.parse(response.data);
}
