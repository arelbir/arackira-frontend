// Lastik Markası için Zod şeması
import { z } from 'zod';

export const tireBrandSchema = z.object({
  name: z.string().min(2, 'Marka adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type TireBrandFormValues = z.infer<typeof tireBrandSchema>;
