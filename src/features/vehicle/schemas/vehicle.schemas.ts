// src/features/vehicle/schemas/vehicle.schemas.ts
import { z } from 'zod';
import { stringToNumber } from './common.schemas';
import { insuranceSchema, inspectionSchema, uttsSchema, hgsSchema, gpsSchema } from './included.schemas';

// Temel araç şeması (tüm alanlar opsiyonel, genişletmeye uygun)
export const vehicleBaseSchema = z.object({
  id: z.number(),
  plate_number: z.string(),
  branch_id: z.number(),
  vehicle_type_id: z.number(),
  brand_id: z.number(),
  model_id: z.number(),
  vehicle_group_id: z.number(),
  fuel_type_id: z.number(),
  model_year: z.number(),
  color_id: z.number(),
  chassis_number: z.string(),
  engine_number: z.string(),
  first_registration_date: z.coerce.date().optional().nullable(),
  vehicle_responsible_id: z.number(),
  vehicle_km: z.number(),
  vehicle_status_id: z.number(),
  tsb_code: z.string(),
  is_draft: z.boolean(),
  supplier_id: z.number(),
  purchase_price: stringToNumber, // API returns string
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
  insurances: z.array(insuranceSchema).optional(),
  plate_number: z.string().min(3, 'Plaka zorunludur.'),
  branch_id: z.number({ required_error: 'Şube seçimi zorunludur.' }),
  brand_id: z.number({ required_error: 'Marka seçimi zorunludur.' }),
  model_id: z.number({ required_error: 'Model seçimi zorunludur.' }),
  inspections: z.array(inspectionSchema).optional(),
  hgs: z.array(hgsSchema).optional(),
  gps: z.array(gpsSchema).optional(),
});

// Formda kullanılacak olan TypeScript tipini Zod şemasından türet
export type VehicleFormValues = z.infer<typeof vehicleFormValidationSchema>;
