// Model formu için Zod şeması ve tipler
import { z } from 'zod';

export const modelSchema = z.object({
  brand_id: z.number({ required_error: 'Marka seçimi zorunlu' }),
  name: z.string().min(2, 'Model adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type ModelFormValues = z.infer<typeof modelSchema>;
