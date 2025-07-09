import { z } from 'zod';

// Yeni araç oluşturma formu doğrulama şeması
export const vehicleCreateSchema = z.object({
  plate_number: z.string().min(1, 'Plaka zorunlu'),
  brand_id: z.preprocess(val => Number(val), z.number({ invalid_type_error: 'Marka seçin' }).int().positive()),
  model_id: z.preprocess(val => Number(val), z.number({ invalid_type_error: 'Model seçin' }).int().positive()),
  vehicle_type_id: z.number().int().positive(),
  fuel_type_id: z.number().int().positive(),
  transmission_id: z.number().int().positive().nullable(),
  model_year: z
    .number({ invalid_type_error: 'Model yılı zorunlu' })
    .int()
    .min(1900)
    .max(new Date().getFullYear()),
  color_id: z.number().int().positive(),
  // Yeni alanlar draft/save için
  chassis_number: z.string().min(5, 'Şasi numarası zorunlu').optional(),
  is_draft: z.boolean().optional(),
});

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;
// Sadece taslak için kullanılacak tip (chassis_number ve is_draft yeterli)
export type VehicleDraftInput = Pick<VehicleCreateInput, 'chassis_number' | 'is_draft'>;
