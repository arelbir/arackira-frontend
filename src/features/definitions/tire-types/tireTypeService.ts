// Lastik Tipi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface TireType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllTireTypes(token: string | null): Promise<TireType[]> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik tipleri alınamadı');
  return await res.json();
}

export async function createTireType(data: Partial<TireType>, token: string | null): Promise<TireType> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik tipi eklenemedi');
  return await res.json();
}

export async function updateTireType(id: number, data: Partial<TireType>, token: string | null): Promise<TireType> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik tipi güncellenemedi');
  return await res.json();
}

export async function deleteTireType(id: number, token: string | null): Promise<void> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik tipi silinemedi');
  return await res.json();
}
