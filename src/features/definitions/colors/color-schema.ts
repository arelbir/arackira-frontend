// Renk formu için Zod şeması (iskele)
import { z } from 'zod';

export const colorSchema = z.object({
  name: z.string().min(2, 'Renk adı zorunlu ve en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type ColorFormValues = z.infer<typeof colorSchema>;
