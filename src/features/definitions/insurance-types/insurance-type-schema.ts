// Sigorta Tipleri modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam sigorta tipi veri şeması (API yanıtı için)
export const InsuranceTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema (hem yeni kayıt hem düzenleme için)
export const insuranceTypeSchema = z.object({
  name: z.string().min(2, 'Sigorta tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Tip tanımları
export type InsuranceType = z.infer<typeof InsuranceTypeSchema>;
export type InsuranceTypeFormValues = z.infer<typeof insuranceTypeSchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const insuranceTypeExports = (service: any) => service;
