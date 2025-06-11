// Araç servis fonksiyonları
// Güncellenmiş: apiRequest ve Zod şeması kullanılarak
import { z } from 'zod';
import { apiFetch, apiRequest } from '@/lib/api-client';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

// Vehicle için Zod şeması
export const VehicleSchema = z.object({
  id: z.number().nullable().optional(),
  plate_number: z.string(),
  is_draft: z.boolean().optional(),
  branch_id: z.number().nullable().optional(),
  vehicle_type_id: z.number().nullable().optional(),
  brand_id: z.number().nullable().optional(),
  model_id: z.number().nullable().optional(),
  version: z.string().nullable().optional(),
  package: z.string().nullable().optional(),
  vehicle_group_id: z.number().nullable().optional(),
  body_type: z.string().nullable().optional(),
  fuel_type_id: z.number().nullable().optional(),
  transmission_id: z.number().nullable().optional(),
  model_year: z.number().nullable().optional(),
  color_id: z.number().nullable().optional(),
  vehicle_status_id: z.number().nullable().optional(),
  engine_power_hp: z.number().nullable().optional(),
  engine_volume_cc: z.number().nullable().optional(),
  chassis_number: z.string().nullable().optional(),
  engine_number: z.string().nullable().optional(),
  first_registration_date: z.string().nullable().optional(),
  registration_document_number: z.string().nullable().optional(),
  vehicle_responsible_id: z.number().nullable().optional(),
  vehicle_km: z.number().nullable().optional(),
  next_maintenance_date: z.string().nullable().optional(),
  inspection_expiry_date: z.string().nullable().optional(),
  insurance_expiry_date: z.string().nullable().optional(),
  casco_expiry_date: z.string().nullable().optional(),
  exhaust_stamp_expiry_date: z.string().nullable().optional(),
  acquisition_cost: z.number().nullable().optional(),
  acquisition_date: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  current_client_company_id: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

// API ile birebir uyumlu Vehicle tipi
export interface Vehicle extends z.infer<typeof VehicleSchema> {
  // Mevcut tiplerle uyumluluk için boş
}

// Not: apiRequest ile tipler güvenli, ancak mevcut arayüzü korumak için
// hem eski hem yeni yaklaşımı destekliyoruz



export async function getAllVehicles(token?: string): Promise<Vehicle[]> {
  try {
    // Yeni yöntem: apiRequest ve Zod şeması kullanımı
    return apiRequest<Vehicle[]>({
      url: `${API_BASE}/api/vehicles`,
      schema: z.array(VehicleSchema),
      token
    });
  } catch (error) {
    throw new Error('Araçlar alınamadı');
  }
}

// Tek bir aracı ID ile getir
export async function getVehicleById(id: number, token?: string): Promise<Vehicle> {
  try {
    return apiRequest<Vehicle>({
      url: `${API_BASE}/api/vehicles/${id}`,
      schema: VehicleSchema,
      token
    });
  } catch (error) {
    throw new Error('Araç bilgileri alınamadı');
  }
}

export async function createVehicle(data: Partial<Vehicle>, token?: string): Promise<Vehicle> {
  try {
    return apiRequest<Vehicle>({
      url: `${API_BASE}/api/vehicles`,
      method: 'POST',
      body: data,
      schema: VehicleSchema,
      token
    });
  } catch (error) {
    throw new Error('Araç eklenemedi');
  }
}

export async function updateVehicle(id: number, data: Partial<Vehicle>, token?: string): Promise<Vehicle> {
  try {
    return apiRequest<Vehicle>({
      url: `${API_BASE}/api/vehicles/${id}`,
      method: 'PUT',
      body: data,
      schema: VehicleSchema,
      token
    });
  } catch (error) {
    throw new Error('Araç güncellenemedi');
  }
}

// Taslak araçları listele
export async function getDraftVehicles(token?: string): Promise<Vehicle[]> {
  try {
    return apiRequest<Vehicle[]>({
      url: `${API_BASE}/api/vehicles/drafts`,
      schema: z.array(VehicleSchema),
      token
    });
  } catch (error) {
    throw new Error('Taslak araçlar alınamadı');
  }
}

// Tek bir draft aracı ID ile getirir
export async function getDraftVehicleById(id: number, token?: string): Promise<Vehicle> {
  try {
    return apiRequest<Vehicle>({
      url: `${API_BASE}/api/vehicles/drafts/${id}`,
      schema: VehicleSchema,
      token
    });
  } catch (error) {
    throw new Error('Taslak araç getirilemedi');
  }
}

// Normal araç silme fonksiyonu
export async function deleteVehicle(id: number, token?: string): Promise<{ success: boolean }> {
  try {
    return apiRequest<{ success: boolean }>({
      url: `${API_BASE}/api/vehicles/${id}`,
      method: 'DELETE',
      token
    });
  } catch (error) {
    throw new Error('Araç silinemedi');
  }
}

// Taslak aracı sil
export async function deleteDraftVehicle(id: number, token?: string): Promise<{ success: boolean }> {
  try {
    return apiRequest<{ success: boolean }>({
      url: `${API_BASE}/api/vehicles/drafts/${id}`,
      method: 'DELETE',
      token
    });
  } catch (error) {
    throw new Error('Taslak araç silinemedi');
  }
}
