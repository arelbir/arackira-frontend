// Araç formu için Zod şeması (iskele)
import { z } from 'zod';

export const vehicleSchema = z.object({
  plate_number: z.string().min(2, 'Plaka zorunlu'),
  branch_id: z.number({ required_error: 'Şube zorunlu' }),
  vehicle_type_id: z.number({ required_error: 'Araç tipi zorunlu' }),
  brand_id: z.number({ required_error: 'Marka zorunlu' }),
  model_id: z.number({ required_error: 'Model zorunlu' }),
  version: z.string().optional(),
  package: z.string().optional(),
  vehicle_group_id: z.number().optional(),
  body_type: z.string().optional(),
  fuel_type_id: z.number({ required_error: 'Yakıt tipi zorunlu' }),
  transmission_id: z.number({ required_error: 'Vites tipi zorunlu' }),
  model_year: z.number().min(1900, 'Model yılı zorunlu'),
  color_id: z.number({ required_error: 'Renk zorunlu' }),
  engine_power_hp: z.number().optional(),
  engine_volume_cc: z.number().optional(),
  chassis_number: z.string().min(5, 'Şasi no zorunlu'),
  engine_number: z.string().optional(),
  first_registration_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'İlk tescil tarihi zorunlu ve geçerli bir tarih olmalı (YYYY-AA-GG)'
  }),
  registration_document_number: z.string().optional(),
  vehicle_responsible_id: z.number().optional(),
  vehicle_km: z.number().min(0).optional(),
  next_maintenance_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  inspection_expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  insurance_expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  casco_expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  exhaust_stamp_expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  acquisition_cost: z.number().min(0, 'Satın alma maliyeti zorunlu'),
  acquisition_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Satın alma tarihi zorunlu ve geçerli bir tarih olmalı (YYYY-AA-GG)'
  }),
  current_status: z.string(),
  notes: z.string().optional(),
  current_client_company_id: z.number({
    required_error: 'Geçerli müşteri firma ID zorunlu ve sayı olmalı',
    invalid_type_error: 'Geçerli müşteri firma ID zorunlu ve sayı olmalı'
  })
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
