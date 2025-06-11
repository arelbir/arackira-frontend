// Branch modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Tam branch veri şeması
export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  created_at: z.string()
});

// Form değerleri için şema
export const branchSchema = z.object({
  name: z.string().min(2, 'Şube adı zorunlu ve en az 2 karakter olmalı'),
  address: z.string().optional(),
  phone: z.string().optional()
});

// Tip tanımları
export type Branch = z.infer<typeof BranchSchema>;
export type BranchFormValues = z.infer<typeof branchSchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const branchExports = (service: any) => service;
