// Agency modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam agency veri şeması
export const AgencySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema
export const agencySchema = z.object({
  name: z.string().min(2, 'Ajans adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Tip tanımları
export type Agency = z.infer<typeof AgencySchema>;
export type AgencyFormValues = z.infer<typeof agencySchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const agencyExports = (service: any) => service;

