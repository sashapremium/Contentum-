// CRUD-запросы для шаблонов, привязанных к учреждению.

import { api } from '@/lib/axios';
import {
  type Template,
  TemplateSchema,
  type TemplateDeleteResponse,
  TemplateDeleteResponseSchema,
} from '../types';

export interface TemplateWithAssetsPayload {
  manifest: Template;
  assets: Record<string, File>;
  replaceAssets?: boolean;
}

function buildFormData({
  manifest,
  assets,
  replaceAssets,
}: TemplateWithAssetsPayload): FormData {
  const formData = new FormData();
  formData.append('template', JSON.stringify(manifest));
  if (replaceAssets !== undefined) {
    formData.append('replaceAssets', String(replaceAssets));
  }
  for (const [name, file] of Object.entries(assets)) {
    formData.append(name, file);
  }
  return formData;
}

export async function createTemplate(
  theatreId: number,
  payload: Template | TemplateWithAssetsPayload,
): Promise<Template> {
  const body = 'manifest' in payload ? buildFormData(payload) : payload;
  const response = await api.post(
    `/theatres/${theatreId}/brandbook/templates/`,
    body,
  );
  return TemplateSchema.parse(response.data);
}

export async function fetchTemplate(
  theatreId: number,
  templateId: string,
): Promise<Template> {
  const response = await api.get(
    `/theatres/${theatreId}/brandbook/templates/${templateId}/`,
  );
  return TemplateSchema.parse(response.data);
}

export async function updateTemplate(
  theatreId: number,
  templateId: string,
  payload: Template | TemplateWithAssetsPayload,
): Promise<Template> {
  const body = 'manifest' in payload ? buildFormData(payload) : payload;
  const response = await api.patch(
    `/theatres/${theatreId}/brandbook/templates/${templateId}/`,
    body,
  );
  return TemplateSchema.parse(response.data);
}

export async function deleteTemplate(
  theatreId: number,
  templateId: string,
): Promise<TemplateDeleteResponse> {
  const response = await api.delete(
    `/theatres/${theatreId}/brandbook/templates/${templateId}/`,
  );
  return TemplateDeleteResponseSchema.parse(response.data);
}
