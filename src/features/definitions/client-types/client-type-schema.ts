// Müşteri tipleri modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam müşteri tipi veri şeması
export const ClientTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema
export const clientTypeSchema = z.object({
  name: z.string().min(2, 'Müşteri tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Tip tanımları
export type ClientType = z.infer<typeof ClientTypeSchema>;
export type ClientTypeFormValues = z.infer<typeof clientTypeSchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const clientTypeExports = (service: any) => service;
