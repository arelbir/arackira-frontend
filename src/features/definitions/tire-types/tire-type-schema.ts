// Lastik Tipi için Zod şeması
import { z } from 'zod';

export const tireTypeSchema = z.object({
  name: z.string().min(2, 'Tip adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type TireTypeFormValues = z.infer<typeof tireTypeSchema>;
