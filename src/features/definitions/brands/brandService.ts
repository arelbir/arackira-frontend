// Brand CRUD API servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';


export interface Brand {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllBrands() {
  const res = await apiFetch(`${API_BASE}/api/brands`);
  if (!res.ok) throw new Error('Markalar alınamadı');
  return await res.json();
}

export async function createBrand(data: Omit<Brand, 'id' | 'created_at'>) {
  const res = await apiFetch(`${API_BASE}/api/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Marka eklenemedi');
  return await res.json();
}

export async function updateBrand(id: number, data: Partial<Omit<Brand, 'id' | 'created_at'>>) {
  const res = await apiFetch(`${API_BASE}/api/brands/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Marka güncellenemedi');
  return await res.json();
}

export async function deleteBrand(id: number) {
  const res = await apiFetch(`${API_BASE}/api/brands/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Marka silinemedi');
  return await res.json();
}
