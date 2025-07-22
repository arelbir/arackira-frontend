// src/features/vehicle/schemas/vehicle.schemas.ts
import { z } from 'zod';
import { stringToNumber } from './common.schemas';
import { insuranceSchema, inspectionSchema, uttsSchema, hgsSchema, gpsSchema } from './included.schemas';

// Temel araç şeması (tüm alanlar opsiyonel, genişletmeye uygun)
export const vehicleBaseSchema = z.object({
  id: z.number(),
  plate_number: z.string(),
  branch_id: z.number().nullable(),
  vehicle_type_id: z.number().nullable(),
  brand_id: z.number().nullable(),
  model_id: z.number().nullable(),
  version: z.string().optional().nullable(),
  package: z.string().optional().nullable(),
  vehicle_group_id: z.number().nullable(),
  body_type: z.string().optional().nullable(),
  fuel_type_id: z.number().nullable(),
  transmission_id: z.number().optional().nullable(),
  model_year: z.number().nullable(),
  color_id: z.number().nullable(),
  engine_power_hp: z.number().optional().nullable(),
  engine_volume_cc: z.number().optional().nullable(),
  chassis_number: z.string().nullable(),
  engine_number: z.string().optional().nullable(),
  first_registration_date: z.coerce.date().optional().nullable(),
  registration_document_number: z.string().optional().nullable(),
  vehicle_responsible_id: z.number().nullable(),
  vehicle_km: z.number().nullable(),
  next_maintenance_date: z.coerce.date().optional().nullable(),
  inspection_expiry_date: z.coerce.date().optional().nullable(),
  insurance_expiry_date: z.coerce.date().optional().nullable(),
  casco_expiry_date: z.coerce.date().optional().nullable(),
  exhaust_stamp_expiry_date: z.coerce.date().optional().nullable(),
  vehicle_status_id: z.number().nullable(),
  tsb_code: z.string().optional().nullable(),
  is_draft: z.boolean(),
  supplier_id: z.number().nullable(),
  purchase_price: stringToNumber.optional().nullable(), // API returns string
  invoice_date: z.coerce.date().optional().nullable(), // API returns string
});

// Senaryo 1: Taslak oluşturma
export const vehicleDraftSchema = vehicleBaseSchema.pick({
  chassis_number: true,
});

// Senaryo 2: API'den gelen tam yanıt
export const vehicleApiResponseSchema = z.object({
  data: vehicleBaseSchema,
  included: z.object({
    insurances: z.array(insuranceSchema).optional(),
    inspections: z.array(inspectionSchema).optional(),
    utts: z.array(uttsSchema).optional(),
    hgs: z.array(hgsSchema).optional(),
    gps: z.array(gpsSchema).optional(),
  }).optional(),
});

// Senaryo 3: Form validasyonu
export const vehicleFormValidationSchema = vehicleBaseSchema.extend({
  // Sayısal alanları string'den number'a dönüştür
  model_year: z.coerce.number().nullable(),
  vehicle_km: z.coerce.number().nullable(),
  engine_power_hp: z.coerce.number().optional().nullable(),
  engine_volume_cc: z.coerce.number().optional().nullable(),
  insurances: z.array(insuranceSchema).optional(),
  plate_number: z.string().min(3, 'Plaka zorunludur.'),
  branch_id: z.number({ required_error: 'Şube seçimi zorunludur.' }),
  brand_id: z.number({ required_error: 'Marka seçimi zorunludur.' }),
  model_id: z.number({ required_error: 'Model seçimi zorunludur.' }),
  inspections: z.array(inspectionSchema).optional(),
  hgs: z.array(hgsSchema).optional(),
  gps: z.array(gpsSchema).optional(),
  utts: z.array(uttsSchema).optional(),
  
  // Silinmesi istenen kayıtların ID'lerini tutmak için
  deleted_ids: z.object({
    gps: z.array(z.number()).optional(),
    insurances: z.array(z.number()).optional(),
    hgs: z.array(z.number()).optional(),
    inspections: z.array(z.number()).optional(),
    utts: z.array(z.number()).optional(),
  }).optional(),
});

// Formda kullanılacak olan TypeScript tipini Zod şemasından türet
export type VehicleFormValues = z.infer<typeof vehicleFormValidationSchema>;
