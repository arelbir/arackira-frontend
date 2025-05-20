// src/services/authService.ts

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/users`;

export async function login(
  username: string,
  password: string
): Promise<AuthUser> {
  const res = await apiFetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Giriş başarısız.');
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data.user;
}

export async function register(
  username: string,
  password: string,
  role?: string
): Promise<AuthUser> {
  const res = await apiFetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kayıt başarısız.');
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data.user;
}

export async function logout(): Promise<void> {
  await apiFetch(`${API_BASE}/logout`, {
    method: 'POST'
  });
  localStorage.removeItem('token');
}

import { apiFetch } from './api';

export async function getMe(): Promise<AuthUser | null> {
  const res = await apiFetch(`${API_BASE}/me`);
  if (res.status === 401) return null;
  const data = await res.json();
  if (!res.ok) return null;
  return data;
}
