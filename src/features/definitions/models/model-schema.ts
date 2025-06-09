// Model modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam model veri şeması
export const ModelSchema = z.object({
  id: z.number(),
  brand_id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema
export const modelSchema = z.object({
  brand_id: z.number({ required_error: 'Marka seçimi zorunlu' }),
  name: z.string().min(2, 'Model adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Tip tanımları
export type Model = z.infer<typeof ModelSchema>;
export type ModelFormValues = z.infer<typeof modelSchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const modelExports = (service: any) => service;
