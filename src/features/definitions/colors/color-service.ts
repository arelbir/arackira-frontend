// Yeni hook tabanlı mimari için güncellendi
import { createDefinitionService } from '@/lib/definition-service-factory';
import { ColorSchema, Color } from './color-schema';

/**
 * Color Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri hook tabanlı (use- prefix ile)
 */
export const colorService = createDefinitionService<Color>('colors', ColorSchema);

// Hook bazlı servis fonksiyonlarını dışa aktar
export const useGetAllColors = colorService.useGetAll;
export const useGetColorById = colorService.useGetById;
export const useCreateColor = colorService.useCreate;
export const useUpdateColor = colorService.useUpdate;
export const useDeleteColor = colorService.useDelete;

// Re-export Color tipi için
export type { Color };
