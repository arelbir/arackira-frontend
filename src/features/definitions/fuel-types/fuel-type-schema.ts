// Fuel Type modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam FuelType veri şeması (API'dan dönen tam veri)
export const FuelTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema (form alanları)
export const fuelTypeFormSchema = z.object({
  name: z.string().min(2, 'Yakıt tipi adı zorunlu ve en az 2 karakter olmalı'),
  description: z.string().optional()
});

// Model bileşenlerinde kullanmak için uyumlu schema yapısı
export const fuelTypeSchema = {
  entity: FuelTypeSchema,
  form: fuelTypeFormSchema
};

// Tip tanımları
export type FuelType = z.infer<typeof FuelTypeSchema>;
export type FuelTypeFormValues = z.infer<typeof fuelTypeFormSchema>;
