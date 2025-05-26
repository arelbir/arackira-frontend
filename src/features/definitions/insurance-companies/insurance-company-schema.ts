// Sigorta Şirketi için Zod şeması
import { z } from 'zod';

export const insuranceCompanySchema = z.object({
  name: z.string().min(2, 'Sigorta şirketi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type InsuranceCompanyFormValues = z.infer<typeof insuranceCompanySchema>;
