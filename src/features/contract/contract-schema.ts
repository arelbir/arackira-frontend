import { z } from 'zod';

export const contractSchema = z.object({
  contract_number: z.string().min(1, 'Sözleşme numarası zorunlu'),
  supplier: z.string().min(1, 'Tedarikçi zorunlu'),
  purchase_date: z.string().min(1, 'Satın alma tarihi zorunlu'), // yyyy-mm-dd
  total_value: z.number({ invalid_type_error: 'Tutar sayı olmalı' }),
  notes: z.string().optional()
});

export type ContractFormValues = z.infer<typeof contractSchema>;
