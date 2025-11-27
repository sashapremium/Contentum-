export const tokenStorage = {
  save(tokens: { access: string; refresh: string }) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  },

  load() {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (!access || !refresh) return null;
    return { access, refresh };
  },

  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
