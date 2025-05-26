// Model CRUD API servis fonksiyonları
// NOT: JWT token localStorage'dan alınır ve Authorization header ile gönderilir.
//      Backend'e doğrudan fetch atılır (http://localhost:4000). Credentials: 'include' ile cookie de gönderilir.
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface Model {
  id: number;
  brand_id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllModels() {
  const res = await apiFetch(`${API_BASE}/api/models`);
  if (!res.ok) throw new Error('Modeller alınamadı');
  return await res.json();
}

export async function getModelsByBrand(brandId: number) {
  const res = await apiFetch(`${API_BASE}/api/models/by-brand/${brandId}`);
  if (!res.ok) throw new Error('Model listesi alınamadı');
  return await res.json();
}

export async function createModel(data: Omit<Model, 'id' | 'created_at'>) {
  const res = await apiFetch(`${API_BASE}/api/models`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Model eklenemedi');
  return await res.json();
}

export async function updateModel(id: number, data: Partial<Omit<Model, 'id' | 'created_at'>>) {
  const res = await apiFetch(`${API_BASE}/api/models/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Model güncellenemedi');
  return await res.json();
}

export async function deleteModel(id: number) {
  const res = await apiFetch(`${API_BASE}/api/models/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Model silinemedi');
  return await res.json();
}
