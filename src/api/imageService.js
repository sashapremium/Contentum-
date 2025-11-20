import { API_URL } from './config';

export const downloadImage = async (id) => {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${API_URL}/generation-tasks/${id}/download`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  return url; // это нормальный URL для img
};
