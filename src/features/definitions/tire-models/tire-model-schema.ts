// Lastik Modeli için Zod şeması
import { z } from 'zod';

export const tireModelSchema = z.object({
  brand_id: z.number({ required_error: 'Marka seçimi zorunlu' }),
  name: z.string().min(2, 'Model adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type TireModelFormValues = z.infer<typeof tireModelSchema>;
