// Servis Şirketi için Zod şeması
import { z } from 'zod';

export const serviceCompanySchema = z.object({
  name: z.string().min(2, 'Servis şirketi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type ServiceCompanyFormValues = z.infer<typeof serviceCompanySchema>;
