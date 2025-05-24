// Renk servis fonksiyonları
// NOT: JWT token localStorage'dan alınır ve Authorization header ile gönderilir.
//      Backend'e doğrudan fetch atılır (http://localhost:4000). Credentials: 'include' ile cookie de gönderilir.
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function getAllColors() {
  const res = await apiFetch(`${API_BASE}/api/colors`);
  if (!res.ok) throw new Error('Renkler alınamadı');
  return await res.json();
}

export async function createColor(data: any) {
  const res = await apiFetch(`${API_BASE}/api/colors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Renk eklenemedi');
  return await res.json();
}

export async function updateColor(id: number, data: any) {
  const res = await apiFetch(`${API_BASE}/api/colors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Renk güncellenemedi');
  return await res.json();
}

export async function deleteColor(id: number) {
  const res = await apiFetch(`${API_BASE}/api/colors/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Renk silinemedi');
  return await res.json();
}
