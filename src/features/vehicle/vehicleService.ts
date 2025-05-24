// Araç servis fonksiyonları
// NOT: JWT token localStorage'dan alınır ve Authorization header ile gönderilir.
//      Backend'e doğrudan fetch atılır (http://localhost:4000). Credentials: 'include' ile cookie de gönderilir.
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

// API ile birebir uyumlu Vehicle tipi
export interface Vehicle {
  id: number;
  plate_number: string;
  branch_id: number;
  vehicle_type_id: number;
  brand_id: number;
  model_id: number;
  version?: string;
  package?: string;
  vehicle_group_id?: number;
  body_type?: string;
  fuel_type_id: number;
  transmission_id: number;
  model_year: number;
  color_id: number;
  engine_power_hp?: number;
  engine_volume_cc?: number;
  chassis_number: string;
  engine_number?: string;
  first_registration_date: string;
  registration_document_number?: string;
  vehicle_responsible_id?: number;
  vehicle_km?: number;
  next_maintenance_date?: string;
  inspection_expiry_date?: string;
  insurance_expiry_date?: string;
  casco_expiry_date?: string;
  exhaust_stamp_expiry_date?: string;
  acquisition_cost?: number;
  acquisition_date?: string;
  current_status?: string;
  notes?: string;
  current_client_company_id?: number;
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const res = await apiFetch(`${API_BASE}/api/vehicles`);
  if (!res.ok) throw new Error('Araçlar alınamadı');
  return await res.json();
}

export async function createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
  const res = await apiFetch(`${API_BASE}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Araç eklenemedi');
  return await res.json();
}

export async function updateVehicle(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
  const res = await apiFetch(`${API_BASE}/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Araç güncellenemedi');
  return await res.json();
}

export async function deleteVehicle(id: number): Promise<{ success: boolean }> {
  const res = await apiFetch(`${API_BASE}/api/vehicles/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Araç silinemedi');
  return await res.json();
}
