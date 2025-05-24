import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface VehicleStatus {
  id: number;
  name: string;
  description?: string;
}

export async function getAllVehicleStatuses(token: string): Promise<VehicleStatus[]> {
  const res = await apiFetch(`${API_BASE}/api/vehicle-statuses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Araç statüleri alınamadı');
  return await res.json();
}

export async function createVehicleStatus(data: Omit<VehicleStatus, 'id'>, token: string): Promise<VehicleStatus> {
  const res = await apiFetch(`${API_BASE}/api/vehicle-statuses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Statü eklenemedi');
  return await res.json();
}

export async function updateVehicleStatus(id: number, data: Omit<VehicleStatus, 'id'>, token: string): Promise<VehicleStatus> {
  const res = await apiFetch(`${API_BASE}/api/vehicle-statuses/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Statü güncellenemedi');
  return await res.json();
}

export async function deleteVehicleStatus(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/definitions/vehicle-statuses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Statü silinemedi');
  return await res.json();
}
