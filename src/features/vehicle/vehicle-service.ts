import { z } from 'zod';
import { createService } from '@/lib/create-service';

// Vehicle için Zod şeması
// Mevcut araç arayüzüne uyumlu olarak tasarlanmıştır
// Tüm alanlar nullable ve optional olarak işaretlenmiştir - geçiş süreci için güvenli validasyon
export const VehicleSchema = z.object({
  id: z.number(),  // createService için id gerekli ve null olamaz
  plate_number: z.string().nullable().optional(),
  is_draft: z.boolean().nullable().optional(),
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
  tsb_code: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional()
});

export type Vehicle = z.infer<typeof VehicleSchema>;

/**
 * Araç Servisi
 * Merkezi servis yapısı kullanılarak oluşturulmuştur
 */
export const vehicleService = createService<Vehicle>('vehicles', VehicleSchema);

/**
 * Normal Araç Servisleri
 */

// Tüm araçları getir
export const getAllVehicles = () => {
  const service = vehicleService.getAll();
  return {
    queryFn: service.queryFn,
    enabled: service.enabled
  };
};

// Araç detayı getir
export const getVehicleById = (id: number) => {
  const service = vehicleService.getById(id);
  return {
    queryFn: service.queryFn,
    enabled: service.enabled
  };
};

// Yeni araç oluştur
export const createVehicle = async (data: Partial<Vehicle>): Promise<Vehicle> => {
  const service = vehicleService.create();
  return service.mutationFn(data);
};

// Araç güncelle
export const updateVehicle = async (
  id: number, 
  data: Partial<Vehicle>
): Promise<Vehicle> => {
  const service = vehicleService.update();
  return service.mutationFn({ id, data });
};

// Araç sil
export const deleteVehicle = async (id: number): Promise<{ success: boolean }> => {
  const service = vehicleService.delete();
  return service.mutationFn(id);
};

/**
 * Draft Araç Servisleri
 * Özelleştirilmiş endpoint'ler için ek servis fonksiyonları
 */

// Taslak araçlar için özel servis oluştur
const draftVehicleService = {
  // Tüm taslak araçları getir
  getAll: () => {
    const { useAuthenticatedQuery } = require('@/lib/auth-api-client');
    const api = useAuthenticatedQuery();
    
    return {
      queryFn: () => api.get('/api/vehicles/drafts', z.array(VehicleSchema)),
      enabled: api.isEnabled()
    };
  },
  
  // Taslak araç detayını getir
  getById: (id: number) => {
    const { useAuthenticatedQuery } = require('@/lib/auth-api-client');
    const api = useAuthenticatedQuery();
    
    return {
      queryFn: () => api.get(`/api/vehicles/drafts/${id}`, VehicleSchema),
      enabled: api.isEnabled()
    };
  },
  
  // Taslak aracı sil
  delete: () => {
    const { useAuthenticatedQuery } = require('@/lib/auth-api-client');
    const api = useAuthenticatedQuery();
    
    return {
      mutationFn: (id: number) => api.delete(`/api/vehicles/drafts/${id}`)
    };
  }
};

// Taslak araçları listele
export const getDraftVehicles = () => {
  const service = draftVehicleService.getAll();
  return {
    queryFn: service.queryFn,
    enabled: service.enabled
  };
};

// Tek bir taslak aracı ID ile getir
export const getDraftVehicleById = (id: number) => {
  const service = draftVehicleService.getById(id);
  return {
    queryFn: service.queryFn,
    enabled: service.enabled
  };
};

// Taslak aracı sil
export const deleteDraftVehicle = async (id: number): Promise<{ success: boolean }> => {
  const service = draftVehicleService.delete();
  return service.mutationFn(id);
};
