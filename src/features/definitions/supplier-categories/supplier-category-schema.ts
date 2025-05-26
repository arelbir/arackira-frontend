// Tedarikçi Kategorisi için Zod şeması
import { z } from 'zod';

export const supplierCategorySchema = z.object({
  name: z.string().min(2, 'Tedarikçi kategorisi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type SupplierCategoryFormValues = z.infer<typeof supplierCategorySchema>;
