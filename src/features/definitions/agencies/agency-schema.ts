import { z } from 'zod';

/**
 * Ajans varlık tipi için Zod şeması
 * API'den gelen tam varlık biçimi
 */
export const AgencySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

/**
 * Ajans form değerleri için Zod şeması
 * Kullanıcı tarafından girilecek form alanları
 */
export const AgencyFormSchema = z.object({
  name: z.string().min(2, 'Ajans adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Tip tanımlamaları
export type Agency = z.infer<typeof AgencySchema>;
export type AgencyFormValues = z.infer<typeof AgencyFormSchema>;

