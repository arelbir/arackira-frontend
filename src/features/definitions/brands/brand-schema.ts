// Brand modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam brand veri şeması
export const BrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema
export const brandSchema = z.object({
  name: z.string().min(2, 'Marka adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Tip tanımları
export type Brand = z.infer<typeof BrandSchema>;
export type BrandFormValues = z.infer<typeof brandSchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const brandExports = (service: any) => service;
