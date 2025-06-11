// Araç formu için Zod şeması (iskele)
import { z } from 'zod';

// Araç kayıt formu için sadeleştirilmiş şema: Sadece plaka zorunlu, diğer tüm alanlar opsiyonel/nullable
// Form state ve step wizard için draft ID'yi tutmak üzere opsiyonel id alanı eklendi
export const vehicleSchema = z.object({
  id: z.number().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  is_draft: z.boolean().optional(),
  branch_id: z.number().optional().nullable(),
  vehicle_type_id: z.number().optional().nullable(),
  brand_id: z.number().optional().nullable(),
  model_id: z.number().optional().nullable(),
  version: z.string().optional().nullable(),
  package: z.string().optional().nullable(),
  vehicle_group_id: z.number().optional().nullable(),
  body_type: z.string().optional().nullable(),
  fuel_type_id: z.number().optional().nullable(),
  transmission_id: z.number().optional().nullable(),
  model_year: z.number().optional().nullable(),
  color_id: z.number().optional().nullable(),
  engine_power_hp: z.number().optional().nullable(),
  engine_volume_cc: z.number().optional().nullable(),
  chassis_number: z.string().min(1, 'Şasi numarası zorunludur'),
  engine_number: z.string().optional().nullable(),
  first_registration_date: z.string().optional().nullable(),
  registration_document_number: z.string().optional().nullable(),
  vehicle_responsible_id: z.number().optional().nullable(),
  vehicle_km: z.number().optional().nullable(),
  next_maintenance_date: z.string().optional().nullable(),
  inspection_expiry_date: z.string().optional().nullable(),
  insurance_expiry_date: z.string().optional().nullable(),
  casco_expiry_date: z.string().optional().nullable(),
  exhaust_stamp_expiry_date: z.string().optional().nullable(),
  acquisition_cost: z.number().optional().nullable(),
  acquisition_date: z.string().optional().nullable(),
  current_status: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  current_client_company_id: z.number().optional().nullable(),
  vehicle_status_id: z.number().optional().nullable(),
  tsb_code: z.string().optional().nullable()
});


export type VehicleFormValues = z.infer<typeof vehicleSchema>;
