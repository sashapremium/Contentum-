/* eslint-disable @typescript-eslint/no-explicit-any */
export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  me: ['users/me'] as const,
  summary: ['users/summary'] as const,
  list: (params?: any) => ['users', { params }] as const,
  detail: (id: string) => ['users', id] as const,
};
