// Lastik Markası servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface TireBrand {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllTireBrands(token: string | null): Promise<TireBrand[]> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-brands`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik markaları alınamadı');
  return await res.json();
}

export async function createTireBrand(data: Omit<TireBrand, 'id' | 'created_at'>, token: string | null): Promise<TireBrand> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-brands`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik markası eklenemedi');
  return await res.json();
}

export async function updateTireBrand(id: number, data: Omit<TireBrand, 'id' | 'created_at'>, token: string | null): Promise<TireBrand> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-brands/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik markası güncellenemedi');
  return await res.json();
}

export async function deleteTireBrand(id: number, token: string | null): Promise<void> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-brands/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik markası silinemedi');
  return await res.json();
}
