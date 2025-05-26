// Lastik Durumu için Zod şeması
import { z } from 'zod';

export const tireConditionSchema = z.object({
  name: z.string().min(2, 'Durum adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type TireConditionFormValues = z.infer<typeof tireConditionSchema>;
