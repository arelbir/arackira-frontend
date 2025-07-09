// Sigorta Şirketleri modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam sigorta şirketi veri şeması (API yanıtı için)
export const InsuranceCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema (hem yeni kayıt hem düzenleme için)
export const insuranceCompanySchema = z.object({
  name: z.string().min(2, 'Sigorta şirketi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Tip tanımları
export type InsuranceCompany = z.infer<typeof InsuranceCompanySchema>;
export type InsuranceCompanyFormValues = z.infer<typeof insuranceCompanySchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const insuranceCompanyExports = (service: any) => service;
