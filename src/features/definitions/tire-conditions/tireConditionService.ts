// Lastik Durumu servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface TireCondition {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllTireConditions(token: string | null): Promise<TireCondition[]> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-conditions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik durumları alınamadı');
  return await res.json();
}

export async function createTireCondition(data: Partial<TireCondition>, token: string | null): Promise<TireCondition> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-conditions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik durumu eklenemedi');
  return await res.json();
}

export async function updateTireCondition(id: number, data: Partial<TireCondition>, token: string | null): Promise<TireCondition> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-conditions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik durumu güncellenemedi');
  return await res.json();
}

export async function deleteTireCondition(id: number, token: string | null): Promise<void> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-conditions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik durumu silinemedi');
  return await res.json();
}
