// Tedarikçi için Zod şeması
import { z } from 'zod';

export const tyreSupplierSchema = z.object({
  name: z.string().min(2, 'Tedarikçi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type TyreSupplierFormValues = z.infer<typeof tyreSupplierSchema>;
