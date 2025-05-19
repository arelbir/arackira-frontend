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
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role }),
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Kayıt başarısız.');
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data.user;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}

export async function getMe(): Promise<AuthUser | null> {
  // Önce localStorage'da token varsa header ile gönder
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers,
    credentials: 'include'
  });
  if (res.status === 401) return null;
  const data = await res.json();
  if (!res.ok) return null;
  return data;
}
