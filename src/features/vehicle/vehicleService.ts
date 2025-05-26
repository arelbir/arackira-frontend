// Araç servis fonksiyonları
// NOT: JWT token localStorage'dan alınır ve Authorization header ile gönderilir.
//      Backend'e doğrudan fetch atılır (http://localhost:4000). Credentials: 'include' ile cookie de gönderilir.
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

// API ile birebir uyumlu Vehicle tipi
// Backend ile uyumlu Vehicle arayüzü, is_draft alanı eklendi
// id alanı artık number | null | undefined olabilir (şema ve form ile uyumlu)
export interface Vehicle {
  id?: number | null;
  plate_number: string;
  is_draft?: boolean;
  branch_id?: number | null;
  vehicle_type_id?: number | null;
  brand_id?: number | null;
  model_id?: number | null;
  version?: string | null;
  package?: string | null;
  vehicle_group_id?: number | null;
  body_type?: string | null;
  fuel_type_id?: number | null;
  transmission_id?: number | null;
  model_year?: number | null;
  color_id?: number | null;
  vehicle_status_id?: number | null;
  engine_power_hp?: number | null;
  engine_volume_cc?: number | null;
  chassis_number?: string | null;
  engine_number?: string | null;
  first_registration_date?: string | null;
  registration_document_number?: string | null;
  vehicle_responsible_id?: number | null;
  vehicle_km?: number | null;
  next_maintenance_date?: string | null;
  inspection_expiry_date?: string | null;
  insurance_expiry_date?: string | null;
  casco_expiry_date?: string | null;
  exhaust_stamp_expiry_date?: string | null;
  acquisition_cost?: number | null;
  acquisition_date?: string | null;
  notes?: string | null;
  current_client_company_id?: number | null;
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

// Taslak araçları listele
export async function getDraftVehicles(): Promise<Vehicle[]> {
  const res = await apiFetch(`${API_BASE}/api/vehicles/drafts`);
  if (!res.ok) throw new Error('Taslak araçlar alınamadı');
  return res.json();
}

// Tek bir draft aracı ID ile getirir
export async function getDraftVehicleById(id: number): Promise<Vehicle> {
  const res = await apiFetch(`${API_BASE}/api/vehicles/drafts/${id}`);
  if (!res.ok) throw new Error('Taslak araç getirilemedi');
  return res.json();
}

// Normal araç silme fonksiyonu
export async function deleteVehicle(id: number): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/vehicles/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Araç silinemedi');
}

// Taslak aracı sil
export async function deleteDraftVehicle(id: number): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/vehicles/drafts/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Taslak araç silinemedi');
}
