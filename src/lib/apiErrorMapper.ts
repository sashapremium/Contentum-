import type { AxiosError } from 'axios';
import { z, type ZodError } from 'zod';

const DEFAULT_ERROR = 'Неизвестная ошибка. Повторите попытку позже';

export function mapApiError(
  error: { name: string } | null,
  defaultError: string = DEFAULT_ERROR
): string {
  if (!error || typeof error !== 'object') return defaultError;

  console.error('mapApiError', { error });

  if (error.name === 'ZodError') {
    const zodError = error as ZodError;

    return z.prettifyError(zodError);
  }

  if (error.name === 'AxiosError') {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.message;
    const data = axiosError.response?.data;

    if (!data || typeof data !== 'object') {
      switch (true) {
        case errorMessage.includes('Network'):
          return 'Проверьте подключение к сети.';
        default:
          return defaultError;
      }
    }

    if (typeof (data as { detail: string }).detail === 'string') {
      return translateBackendMessage((data as { detail: string }).detail);
    }

    if (typeof (data as { error: string }).error === 'string') {
      return translateBackendMessage((data as { error: string }).error);
    }

    const fieldMessage = extractFieldError(data);
    if (fieldMessage) return fieldMessage;

    return defaultError;
  }

  return defaultError;
}

function translateBackendMessage(message: string): string {
  switch (true) {
    case message.includes('No active account'):
      return 'Пользователь не найден.';
    case message.includes('Invalid token'):
      return 'Неверный токен авторизации.';
    case message.includes('exists'):
      return 'Пользователь уже существует.';
    case message.includes('required'):
      return 'Обязательное поле.';
    case message.includes('Страница не найдена.'):
      return 'Страница не найдена.';
    default:
      return DEFAULT_ERROR;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFieldError(data: any): string | null {
  if (!data || typeof data !== 'object') return null;

  for (const key of Object.keys(data)) {
    const value = data[key];

    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }

    if (typeof value === 'object' && value !== null) {
      const inner = extractFieldError(value);
      if (inner) return inner;
    }
  }

  return null;
}
