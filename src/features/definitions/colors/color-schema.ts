// Color modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam color veri şeması (API'dan dönen tam veri)
export const ColorSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema (form alanları)
export const colorFormSchema = z.object({
  name: z.string().min(2, 'Renk adı zorunlu ve en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Model bileşenlerinde kullanmak için uyumlu schema yapısı
export const colorSchema = {
  // API'dan gelen tam veriyi doğrulayan şema
  entity: ColorSchema,
  // Form için gerekli alanları içeren şema
  form: colorFormSchema
};

// Tip tanımları
export type Color = z.infer<typeof ColorSchema>;
export type ColorFormValues = z.infer<typeof colorFormSchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const colorExports = (service: any) => service;
