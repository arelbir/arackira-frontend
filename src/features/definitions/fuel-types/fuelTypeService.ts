// Yakıt Tipi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface FuelType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllFuelTypes(token: string): Promise<FuelType[]> {
  const res = await apiFetch(`${API_BASE}/api/fuel-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Yakıt tipleri alınamadı');
  return await res.json();
}

export async function createFuelType(data: Omit<FuelType, 'id' | 'created_at'>, token: string): Promise<FuelType> {
  const res = await apiFetch(`${API_BASE}/api/fuel-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Yakıt tipi eklenemedi');
  return await res.json();
}

export async function updateFuelType(id: number, data: Omit<FuelType, 'id' | 'created_at'>, token: string): Promise<FuelType> {
  const res = await apiFetch(`${API_BASE}/api/fuel-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Yakıt tipi güncellenemedi');
  return await res.json();
}

export async function deleteFuelType(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/fuel-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Yakıt tipi silinemedi');
  return await res.json();
}
