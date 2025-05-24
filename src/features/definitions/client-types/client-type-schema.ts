// Client Type formu için Zod şeması ve tipler
import { z } from 'zod';

export const clientTypeSchema = z.object({
  name: z.string().min(2, 'Müşteri tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type ClientTypeFormValues = z.infer<typeof clientTypeSchema>;
