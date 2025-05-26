// Ajans için Zod şeması
import { z } from 'zod';

export const agencySchema = z.object({
  name: z.string().min(2, 'Ajans adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type AgencyFormValues = z.infer<typeof agencySchema>;
