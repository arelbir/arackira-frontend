// Lastik Modeli servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface TireModel {
  id: number;
  brand_id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllTireModels(token: string | null): Promise<TireModel[]> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-models`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik modelleri alınamadı');
  return await res.json();
}

export async function createTireModel(data: Partial<TireModel>, token: string | null): Promise<TireModel> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-models`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik modeli eklenemedi');
  return await res.json();
}

export async function updateTireModel(id: number, data: Partial<TireModel>, token: string | null): Promise<TireModel> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-models/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lastik modeli güncellenemedi');
  return await res.json();
}

export async function deleteTireModel(id: number, token: string | null): Promise<void> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tire-models/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lastik modeli silinemedi');
  return await res.json();
}
