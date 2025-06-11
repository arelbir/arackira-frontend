// Araç Tipi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface VehicleType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllVehicleTypes(token: string): Promise<VehicleType[]> {
  const res = await apiFetch(`${API_BASE}/api/vehicle-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Araç tipleri alınamadı');
  return await res.json();
}

export async function createVehicleType(data: Omit<VehicleType, 'id' | 'created_at'>, token: string): Promise<VehicleType> {
  const res = await apiFetch(`${API_BASE}/api/vehicle-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Araç tipi eklenemedi');
  return await res.json();
}

export async function updateVehicleType(id: number, data: Omit<VehicleType, 'id' | 'created_at'>, token: string): Promise<VehicleType> {
  const res = await apiFetch(`${API_BASE}/api/vehicle-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Araç tipi güncellenemedi');
  return await res.json();
}

export async function deleteVehicleType(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/vehicle-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Araç tipi silinemedi');
  return await res.json();
}
