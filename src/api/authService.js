import { API_URL } from './config';

// ----------------------
// REGISTRATION
// ----------------------
export async function registerUser({ email, password, passwordConfirm, name }) {
  const res = await fetch(`${API_URL}/api/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      passwordConfirm,
      fullName: name,
    }),
  });

  return await res.json();
}

// ----------------------
// LOGIN (JWT)
// ----------------------
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok && data.access && data.refresh) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }

  return data;
}

// ----------------------
// REFRESH
// ----------------------
export async function refreshToken() {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json();

  if (res.ok && data.access) {
    localStorage.setItem('access_token', data.access);
    return data.access;
  }

  return null;
}

// ----------------------
// LOGOUT
// ----------------------
export function logoutUser() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}
