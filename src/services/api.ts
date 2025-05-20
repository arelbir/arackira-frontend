// src/services/api.ts
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  // headers'ı Record<string, string> olarak başlat
  const headers: Record<string, string> = {
    ...(init.headers ? (init.headers as Record<string, string>) : {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(input, {
    ...init,
    headers,
    credentials: 'include', // Cookie de gitmeye devam etsin
  });
}

