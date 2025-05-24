import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface VehiclePackage {
  id: number;
  model_id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getPackagesByModel(modelId: number) {
  const res = await apiFetch(`${API_BASE}/api/packages/by-model/${modelId}`);
  if (!res.ok) throw new Error('Paketler alınamadı');
  return await res.json();
}

export async function createPackage(data: Omit<VehiclePackage, 'id' | 'created_at'>) {
  const res = await apiFetch(`${API_BASE}/api/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Paket eklenemedi');
  return await res.json();
}

export async function updatePackage(id: number, data: Partial<Omit<VehiclePackage, 'id' | 'created_at'>>) {
  const res = await apiFetch(`${API_BASE}/api/packages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Paket güncellenemedi');
  return await res.json();
}

export async function deletePackage(id: number) {
  const res = await apiFetch(`${API_BASE}/api/packages/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Paket silinemedi');
  return await res.json();
}
