import { z } from 'zod';

// Fields shown on Satınalma tab moved to purchaseSchema
export const basicInfoSchema = z.object({
  plate_number: z.string().min(1, 'Plaka zorunlu'),
  branch_id: z.number().int().positive(),
  // vehicle_group_id field removed from UI; keep optional for backward compatibility
  vehicle_group_id: z.number().int().positive().optional(),
  vehicle_type_id: z.number().int().positive(),
  brand_id: z.number().int().positive(),
  model_id: z.number().int().positive(),
  model_year: z.number().int().min(1900).max(new Date().getFullYear()),
  body_type: z.string().optional(),
  fuel_type_id: z.number().int().positive().optional(),
  transmission_id: z.number().int().positive().optional(),
  vehicle_status_id: z.number().int().optional(),
  version: z.string().optional(),

  package: z.string().optional(),
  color_id: z.number().int().optional(),


  is_draft: z.boolean().optional(),
});

export const gpsDetailsSchema = z.object({
  gps_tracking_status: z.enum(["true", "false"]),
  device_model: z.string().optional(),
  device_serial_number: z.string().optional(),
  installation_date: z.string().optional(),
  sim_number: z.string().optional(),
  service_provider: z.string().optional(),
  subscription_start: z.string().optional(),
  subscription_end: z.string().optional(),
  installation_location: z.string().optional(),
  description: z.string().optional(),
});

export const purchaseSchema = z.object({
  chassis_number: z.string().min(1, 'Şasi numarası zorunlu'),
  supplier_id: z.number().int().positive(),
  purchase_price: z.number().positive(),
  invoice_date: z.string(),
  tsb_code: z.string().optional(),
});

export const datesSchema = z.object({
  first_registration_date: z.string().optional(),
  registration_document_number: z.string().optional(),
  next_maintenance_date: z.string().optional(),
  inspection_expiry_date: z.string().optional(),
  exhaust_stamp_expiry_date: z.string().optional(),
});

export const insuranceSchema = z.object({
  insurance_expiry_date: z.string().optional(),
  casco_expiry_date: z.string().optional(),
  vehicle_responsible_id: z.number().int().nullable().optional(),
});

// utts şeması 
export const uttsSchema = z.object({
  purchase_date: z.string().optional(), // Satın alım tarihi
  installation_date: z.string().optional(), // Montaj tarihi
  utts_code: z.string().min(1, 'utts kodu zorunlu'), // utts kodu zorunlu alan
});

import { hgsSchema, HGSFormValues } from '@/features/definitions/hgs/hgs-schema';

export const insuranceArraySchema = z.array(z.object({
  insurance_type_id: z.number({ required_error: 'Sigorta türü zorunlu' }).int().positive(),
  start_date: z.string().min(1, 'Başlangıç tarihi zorunlu'),
  policy_date: z.string().min(1, 'Poliçe tarihi zorunlu'),
  end_date: z.string().min(1, 'Bitiş tarihi zorunlu'),

  insurance_company_id: z.number().int().positive().optional(),
  agency_id: z.number().int().positive().optional(),
  policy_number: z.string().optional(),
  tramer: z.string().optional(),
  agency_number: z.string().optional(),
  amount: z.number().optional(),
  tax_rate: z.number().optional(),
  tax_amount: z.number().optional(),
  total_amount: z.number().optional(),
  currency: z.string().optional(),
  installment_count: z.number().optional(),
  payment_type_id: z.number().int().positive().optional(),
  payment_account_id: z.number().int().positive().optional(),
  create_payment_record: z.boolean().optional(),
  description: z.string().optional(),
}));

export const vehicleCreateSchema = basicInfoSchema
  .merge(purchaseSchema)
  .merge(gpsDetailsSchema)
  .merge(datesSchema)
  .merge(uttsSchema) // utts şeması eklendi
  .extend({
    hgsList: z.array(hgsSchema).optional(),
    insurances: insuranceArraySchema.optional(),
  });

export type VehicleCreateValues = z.infer<typeof vehicleCreateSchema> & {
  hgsList?: HGSFormValues[]
};
