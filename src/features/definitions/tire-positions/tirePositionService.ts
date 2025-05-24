// Lastik Pozisyonu servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface TirePosition {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllTirePositions(token: string | null): Promise<TirePosition[]> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-positions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik pozisyonları alınamadı');
  return await res.json();
}

export async function createTirePosition(data: Partial<TirePosition>, token: string | null): Promise<TirePosition> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-positions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik pozisyonu eklenemedi');
  return await res.json();
}

export async function updateTirePosition(id: number, data: Partial<TirePosition>, token: string | null): Promise<TirePosition> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-positions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik pozisyonu güncellenemedi');
  return await res.json();
}

export async function deleteTirePosition(id: number, token: string | null): Promise<void> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-positions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik pozisyonu silinemedi');
  return await res.json();
}
