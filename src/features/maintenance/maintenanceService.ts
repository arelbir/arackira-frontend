// Bakım işlemleri için service fonksiyonları (contractService örnek alınarak)
import { MaintenanceFormValues } from './maintenance-schema';

import { apiFetch } from '@/services/api';
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/maintenance`;

export interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  description: string;
  date: string;
  cost: number;
  notes?: string;
}

export async function getAllMaintenance(): Promise<MaintenanceRecord[]> {
  const res = await apiFetch(API_URL);
  if (!res.ok) throw new Error('Bakım kayıtları alınamadı');
  return res.json();
}

export async function createMaintenance(
  data: MaintenanceFormValues
): Promise<MaintenanceRecord> {
  const res = await apiFetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Bakım kaydı eklenemedi');
  return res.json();
}

export async function updateMaintenance(
  id: number,
  data: MaintenanceFormValues
): Promise<MaintenanceRecord> {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Bakım kaydı güncellenemedi');
  return res.json();
}

export async function deleteMaintenance(
  id: number
): Promise<{ success: boolean }> {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Bakım kaydı silinemedi');
  return res.json();
}
