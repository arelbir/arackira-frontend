// Servis Tipi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllServiceTypes(token: string): Promise<ServiceType[]> {
  const res = await apiFetch(`${API_BASE}/api/service-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Servis tipleri alınamadı');
  return await res.json();
}

export async function createServiceType(data: Omit<ServiceType, 'id' | 'created_at'>, token: string): Promise<ServiceType> {
  const res = await apiFetch(`${API_BASE}/api/service-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Servis tipi eklenemedi');
  return await res.json();
}

export async function updateServiceType(id: number, data: Omit<ServiceType, 'id' | 'created_at'>, token: string): Promise<ServiceType> {
  const res = await apiFetch(`${API_BASE}/api/service-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Servis tipi güncellenemedi');
  return await res.json();
}

export async function deleteServiceType(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/service-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Servis tipi silinemedi');
  return await res.json();
}
