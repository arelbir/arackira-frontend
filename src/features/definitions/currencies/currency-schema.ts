// Para birimleri modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam para birimi veri şeması (API yanıtı için)
export const CurrencySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema (hem yeni kayıt hem düzenleme için)
export const currencySchema = z.object({
  code: z.string().min(1, 'Para birimi kodu gerekli'),
  name: z.string().min(2, 'Para birimi adı en az 2 karakter olmalı'),
  symbol: z.string().min(1, 'Para birimi sembolü gerekli'),
  description: z.string().optional()
});

// Tip tanımları
export type Currency = z.infer<typeof CurrencySchema>;
export type CurrencyFormValues = z.infer<typeof currencySchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const currencyExports = (service: any) => service;
