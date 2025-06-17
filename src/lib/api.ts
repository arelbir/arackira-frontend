export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export async function apiFetcher(path: string, init?: RequestInit) {
  // Retrieve JWT token from localStorage on the client (AuthProvider stores it under "token")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Varsayılan header'lar
  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  // Kullanıcıdan gelen header varsa birleştir
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...(init?.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  const json = await res.json();
  return 'data' in json ? json.data : json;
}

