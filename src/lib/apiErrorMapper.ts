import type { AxiosError } from 'axios';

const DEFAULT_ERROR = 'Неизвестная ошибка. Повторите попытку позже';

export function mapApiError(error: unknown | null): string {
  if (!error || typeof error !== 'object') return DEFAULT_ERROR;

  const err = error as AxiosError;

  const backendMessage =
    (err?.response?.data as { detail: string }).detail ||
    (err?.response?.data as { error: string }).error;

  if (backendMessage) {
    if (
      backendMessage.includes(
        'No active account found with the given credentials'
      )
    )
      return 'Пользователь не найден';

    if (backendMessage.includes('Invalid token'))
      return 'Неверный токен авторизации';

    return DEFAULT_ERROR;
  }

  return DEFAULT_ERROR;
}
