// Araç formu için Zod şeması (iskele)
import { z } from 'zod';

export const vehicleSchema = z.object({
  plate_number: z.string().min(2),
  brand: z.string().min(2),
  model: z.string().min(1),
  chassis_number: z.string().min(5),
  year: z.number().min(1900),
  acquisition_cost: z.number().min(0),
  acquisition_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'Satın alma tarihi zorunlu ve geçerli bir tarih olmalı (YYYY-AA-GG)'
  }),
  current_status: z.string(),
  notes: z.string().optional(),
  current_client_company_id: z.number({
    required_error: 'Geçerli müşteri firma ID zorunlu ve sayı olmalı',
    invalid_type_error: 'Geçerli müşteri firma ID zorunlu ve sayı olmalı'
  })
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
