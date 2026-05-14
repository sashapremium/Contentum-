import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { tokenStorage } from '@/features/auth/utils/tokenStorage';
import { queryClient } from '@/lib/query';

const API_PREFIX = 'http://localhost:8000/api';
// const API_PREFIX = '/api';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: API_PREFIX,
});

const refreshApi = axios.create({
  baseURL: API_PREFIX,
});

api.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();

    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }

    if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

function logoutAndClear() {
  queryClient.clear();
  useAuthStore.getState().logout();
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Non-401 errors have nothing to do with auth — pass through immediately.
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const { tokens, setTokens, isAuthenticated } = useAuthStore.getState();

    // Already logged out (e.g. a deferred retry firing after logout) — reject
    // silently so we don't call logout() a second time or show duplicate toasts.
    if (!isAuthenticated) {
      return Promise.reject(error);
    }

    // The refresh endpoint itself returned 401 — refresh token is invalid.
    if (originalRequest.url?.includes('/auth/refresh')) {
      logoutAndClear();
      return Promise.reject(error);
    }

    // No refresh token in store — can't attempt refresh.
    if (!tokens?.refresh) {
      logoutAndClear();
      return Promise.reject(error);
    }

    if (!originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await refreshApi.post('/auth/refresh', {
          refresh: tokens.refresh,
        });

        const newAccess = refreshResponse.data.access;
        const newRefresh = refreshResponse.data.refresh ?? tokens.refresh;

        setTokens({ access: newAccess, refresh: newRefresh });
        tokenStorage.save({ access: newAccess, refresh: newRefresh });

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutAndClear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
