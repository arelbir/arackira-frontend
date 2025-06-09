// Tedarikçi için Zod şeması
import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(2, 'Tedarikçi adı en az 2 karakter olmalı'),
  tax_number: z.string().optional().nullable(),
  contact_person: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().nullable(),
  address: z.string().optional().nullable(),
  is_active: z.boolean().default(true)
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
