// src/features/vehicle/schemas/included.schemas.ts
import { z } from 'zod';
import { stringToNumber } from './common.schemas';



export const insuranceSchema = z.object({
  id: z.coerce.number().optional(), // Optional for new entries, coerce from string
  vehicle_id: z.number().optional(), // Optional for new entries
  insurance_type_id: z.coerce.number().nullable(),
  insurance_company_id: z.coerce.number().nullable(),
  policy_number: z.string().nullable().optional(),
  tramer: z.string().nullable().optional(),
  start_date: z.coerce.date().optional().nullable(),
  end_date: z.coerce.date().optional().nullable(),
  total_amount: stringToNumber,
  currency: z.string().nullable().optional(),
  description: z.string().optional().nullable(),
  created_at: z.coerce.date().optional().nullable(),
});

export const inspectionSchema = z.object({
  id: z.number().optional(),
  vehicle_id: z.number().optional(),
  inspection_company_id: z.coerce.number().nullable(),
  inspection_date: z.coerce.date().optional().nullable(),
  expiry_date: z.coerce.date().optional().nullable(),
  result: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  cost: stringToNumber,
  created_at: z.coerce.date().optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
});

export const uttsSchema = z.object({
  id: z.number().optional(),
  vehicle_id: z.number().optional(),
  purchase_date: z.coerce.date().optional().nullable(),
  installation_date: z.coerce.date().optional().nullable(),
  utts_code: z.string().min(1, "UTTS Kodu zorunludur."),
  created_at: z.coerce.date().optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
});

export const hgsSchema = z.object({
  id: z.number().optional(),
  vehicle_id: z.number().optional(),
  hgs_place: z.string().nullable().optional(),
  hgs_tag_no: z.string().nullable().optional(),
  hgs_vehicle_class: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  loading_date: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date().optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
});



export const gpsSchema = z.object({
  id: z.number().optional(),
  vehicle_id: z.number().optional(),
  gps_tracking_status: z.boolean().optional(),
  brand: z.string().optional(),
  installation_date: z.coerce.date().optional().nullable(),
  sim_number: z.string().optional(),
  device_model: z.string().optional(),
  device_serial_number: z.string().optional(),
  subscription_start_date: z.coerce.date().optional().nullable(),
  subscription_end_date: z.coerce.date().optional().nullable(),
  service_provider: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  last_update: z.coerce.date().optional().nullable(),
  installation_location: z.string().optional(),
  cancellation_date: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date().optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
});
