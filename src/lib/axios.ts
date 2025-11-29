/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { tokenStorage } from '@/features/auth/utils/tokenStorage';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();

    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });

  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const { tokens, setTokens, logout } = useAuthStore.getState();

    if (!tokens?.refresh) {
      logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post('/auth/refresh/', {
          refresh: tokens.refresh,
        });

        const newAccess = refreshResponse.data.access;
        const newRefresh = refreshResponse.data.refresh ?? tokens.refresh;

        setTokens({
          access: newAccess,
          refresh: newRefresh,
        });

        tokenStorage.save({
          access: newAccess,
          refresh: newRefresh,
        });

        isRefreshing = false;

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
