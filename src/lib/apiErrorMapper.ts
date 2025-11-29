import type { AxiosError } from 'axios';
import { z, type ZodError } from 'zod';

const DEFAULT_ERROR = 'Неизвестная ошибка. Повторите попытку позже';

export function mapApiError(error: { name: string } | null): string {
  if (!error || typeof error !== 'object') return DEFAULT_ERROR;

  if (error.name === 'AxiosError') {
    const axiosError = error as AxiosError;
    const backendMessage =
      (axiosError?.response?.data as { detail: string })?.detail ||
      (axiosError?.response?.data as { error: string })?.error;

    switch (true) {
      case backendMessage.includes(
        'No active account found with the given credentials'
      ):
        return 'Пользователь не найден';

      case backendMessage.includes('Invalid token'):
        return 'Неверный токен авторизации';

      default:
        return DEFAULT_ERROR;
    }
  }

  if (error.name === 'ZodError') {
    const zodError = error as ZodError;

    console.log(z.prettifyError(zodError));
    return z.prettifyError(zodError);
  }

  return DEFAULT_ERROR;
}
