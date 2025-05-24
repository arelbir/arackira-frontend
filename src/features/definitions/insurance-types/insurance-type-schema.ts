// Sigorta Tipi için Zod şeması
import { z } from 'zod';

export const insuranceTypeSchema = z.object({
  name: z.string().min(2, 'Sigorta tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type InsuranceTypeFormValues = z.infer<typeof insuranceTypeSchema>;
