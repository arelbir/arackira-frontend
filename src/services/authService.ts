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
  return data;
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
  return data;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
}

export async function getMe(): Promise<AuthUser | null> {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    credentials: 'include'
  });
  if (res.status === 401) return null;
  const data = await res.json();
  if (!res.ok) return null;
  return data;
}
