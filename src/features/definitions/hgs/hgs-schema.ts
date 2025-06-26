// HGS modülü için Zod şemaları ve tipler
import { z } from 'zod';
import { createNamedDefinitionHooks } from '@/lib/definition-service-factory';

// Backend'deki tabloya uygun tam veri şeması
export const HGSSchema = z.object({
  id: z.number(),
  vehicle_id: z.number(),
  hgs_place: z.string(),
  hgs_tag_no: z.string(),
  hgs_vehicle_class: z.string(),
  is_active: z.boolean().optional(),
  deleted_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.number().nullable().optional(),
  updated_by: z.number().nullable().optional(),
  deleted_by: z.number().nullable().optional(),
});

// Form için kullanılacak şema
export const hgsSchema = z.object({
  vehicle_id: z.coerce.number({ required_error: 'Araç seçimi zorunlu' }),
  hgs_place: z.string().min(2, 'Alındığı yer en az 2 karakter olmalı'),
  hgs_tag_no: z.string().min(2, 'Etiket numarası en az 2 karakter olmalı'),
  hgs_vehicle_class: z.string().min(1, 'Araç sınıfı zorunlu'),
});

// Tip tanımları
export type HGS = z.infer<typeof HGSSchema>;
export type HGSFormValues = z.infer<typeof hgsSchema>;

// Servis bağlantılarını dışa aktarmak için yardımcı fonksiyon
export const hgsExports = (service: any) => service;
