// Lastik Pozisyonu için Zod şeması
import { z } from 'zod';

export const tirePositionSchema = z.object({
  name: z.string().min(2, 'Pozisyon adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type TirePositionFormValues = z.infer<typeof tirePositionSchema>;
