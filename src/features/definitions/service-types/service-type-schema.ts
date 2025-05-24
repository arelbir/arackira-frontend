// Servis Tipi için Zod şeması
import { z } from 'zod';

export const serviceTypeSchema = z.object({
  name: z.string().min(2, 'Servis tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type ServiceTypeFormValues = z.infer<typeof serviceTypeSchema>;
