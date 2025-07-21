import { z } from 'zod';

// Fields shown on Satınalma tab moved to purchaseSchema
// String ID'leri number'a çeviren yardımcı fonksiyon
const stringToNumber = (val: unknown) => {
  if (typeof val === 'string' && val !== '') {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return val;
};

// ID alanları için otomatik string->number dönüşümü yapan schema
const idSchema = z.preprocess(
  stringToNumber,
  z.number().int().positive()
);

// ID alanları için opsiyonel olan schema
const optionalIdSchema = z.preprocess(
  stringToNumber,
  z.number().int().positive().optional()
);

export const basicInfoSchema = z.object({
  plate_number: z.string().min(1, 'Plaka zorunlu'),
  branch_id: idSchema,
  // vehicle_group_id field removed from UI; keep optional for backward compatibility
  vehicle_group_id: optionalIdSchema,
  vehicle_type_id: idSchema,
  brand_id: idSchema,
  model_id: idSchema,
  model_year: z.number().int().min(1900).max(new Date().getFullYear()),
  body_type: z.string().optional(),
  fuel_type_id: z.preprocess(stringToNumber, z.number().int().positive().optional()),
  transmission_id: z.preprocess(stringToNumber, z.number().int().positive().optional()),
  vehicle_status_id: z.preprocess(stringToNumber, z.number().int().optional()),
  version: z.string().optional(),

  package: z.string().optional(),
  color_id: z.preprocess(stringToNumber, z.number().int().optional()),
  engine_number: z.string().optional(),
  vehicle_km: z.preprocess(stringToNumber, z.number().int().positive().optional()),


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
  supplier_id: z.preprocess(stringToNumber, z.number().int().positive()),
  purchase_price: z.number().positive(),
  invoice_date: z.string(),
  tsb_code: z.string().optional(),
});



export const insuranceSchema = z.object({
  insurance_expiry_date: z.string().optional(),
  casco_expiry_date: z.string().optional(),
  vehicle_responsible_id: z.preprocess(stringToNumber, z.number().int().nullable().optional()),
});

// utts şeması 
export const uttsSchema = z.object({
  purchase_date: z.string().optional(), // Satın alım tarihi
  installation_date: z.string().optional(), // Montaj tarihi
  utts_code: z.string().min(1, 'utts kodu zorunlu'), // utts kodu zorunlu alan
});

import { hgsSchema, HGSFormValues } from '@/features/definitions/hgs/hgs-schema';
import { INSPECTION_FIELDS } from './tabs/inspection/inspection-constants';

export const insuranceArraySchema = z.array(z.object({
  insurance_type_id: z.preprocess(stringToNumber, z.number({ required_error: 'Sigorta türü zorunlu' }).int().positive()),
  start_date: z.string().min(1, 'Başlangıç tarihi zorunlu'),
  policy_date: z.string().min(1, 'Poliçe tarihi zorunlu'),
  end_date: z.string().min(1, 'Bitiş tarihi zorunlu'),

  insurance_company_id: z.preprocess(stringToNumber, z.number().int().positive().optional()),
  agency_id: z.preprocess(stringToNumber, z.number().int().positive().optional()),
  policy_number: z.string().optional(),
  tramer: z.string().optional(),
  agency_number: z.string().optional(),
  amount: z.number().optional(),
  tax_rate: z.number().optional(),
  tax_amount: z.number().optional(),
  total_amount: z.number().optional(),
  currency: z.string().optional(),
  installment_count: z.number().optional(),
  payment_type_id: z.preprocess(stringToNumber, z.number().int().positive().optional()),
  payment_account_id: z.preprocess(stringToNumber, z.number().int().positive().optional()),
  create_payment_record: z.boolean().optional(),
  description: z.string().optional(),
}));

// Muayene (Inspection) için Zod şeması
export const inspectionArraySchema = z.array(z.object({
  id: z.union([z.string(), z.number()]).optional(),
  [INSPECTION_FIELDS.INSPECTION_DATE]: z.string({ required_error: 'Muayene tarihi zorunludur' }).min(1, 'Muayene tarihi zorunludur'),
  [INSPECTION_FIELDS.EXPIRY_DATE]: z.string({ required_error: 'Geçerlilik tarihi zorunludur' }).min(1, 'Geçerlilik tarihi zorunludur'),
  [INSPECTION_FIELDS.INSPECTION_COMPANY_ID]: z.preprocess(
    stringToNumber,
    z.number({ required_error: 'Muayene istasyonu zorunludur' }).int().positive('Muayene istasyonu seçmelisiniz')
  ),
  [INSPECTION_FIELDS.RESULT]: z.string().optional(),
  [INSPECTION_FIELDS.COST]: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        if (val === '') return undefined;
        const num = parseFloat(val.replace(',', '.'));
        return isNaN(num) ? val : num;
      }
      return val;
    },
    z.number({invalid_type_error: 'Maliyet sayı olmalıdır'}).positive('Maliyet pozitif bir sayı olmalıdır').optional()
  ),
  [INSPECTION_FIELDS.DESCRIPTION]: z.string().optional(),
}));

// GPS (Uydu Takip) için Zod şeması
export const gpsSchema = z.object({
  id: z.number().optional(),
  gps_tracking_status: z.boolean().default(false),
  brand: z.string().optional(),
  device_model: z.string().optional(),
  installation_date: z.any().optional(),
  sim_number: z.string().optional(),
  device_serial_number: z.string().optional(),
  service_provider: z.string().optional(),
  subscription_start: z.any().optional(),
  subscription_end: z.any().optional(),
  installation_location: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional().default(true),
}).superRefine((data, ctx) => {
  if (data.gps_tracking_status) {
    if (!data.brand) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Marka zorunludur.", path: ['brand'] });
    }
    if (!data.device_model) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cihaz modeli zorunludur.", path: ['device_model'] });
    }
    if (!data.installation_date) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Montaj tarihi zorunludur.", path: ['installation_date'] });
    }
    if (!data.sim_number) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "SIM kart numarası zorunludur.", path: ['sim_number'] });
    }
  }
});

export type GpsSchemaValues = z.infer<typeof gpsSchema>;

export const GPS_DEFAULT_VALUES = {
  gps_tracking_status: false,
  brand: '',
  device_model: '',
  installation_date: '',
  sim_number: '',
  device_serial_number: '',
  service_provider: '',
  subscription_start: '',
  subscription_end: '',
  installation_location: '',
  description: '',
  is_active: true,
};

export const serviceSchema = z.object({
  // service schema
});

export const vehicleCreateSchema = basicInfoSchema
  .merge(purchaseSchema)

  .merge(uttsSchema) // utts şeması eklendi
  .extend({
    insurances: insuranceArraySchema.optional(),
    inspections: inspectionArraySchema.optional(),
    hgs: z.array(hgsSchema).optional(),
    gps: z.array(gpsSchema).optional(),
    services: z.array(serviceSchema).optional(),
  });

export type VehicleCreateValues = z.infer<typeof vehicleCreateSchema> & {
  hgsList?: HGSFormValues[]
};
