// Yeni hook tabanlı mimari için güncellendi
import { useQuery } from '@tanstack/react-query';
import { createDefinitionService } from '@/lib/definition-service-factory';
import { BrandSchema, Brand } from './brand-schema';

/**
 * Brand Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri hook tabanlı (use- prefix ile)
 */
export const brandService = createDefinitionService<Brand>('brands', BrandSchema);

// Hook bazlı servis fonksiyonlarını dışa aktar
export const useGetAllBrands = brandService.useGetAll;
export const useGetBrandById = brandService.useGetById;
export const useCreateBrand = brandService.useCreate;
export const useUpdateBrand = brandService.useUpdate;
export const useDeleteBrand = brandService.useDelete;

// Re-export Brand tipi için
export type { Brand };
