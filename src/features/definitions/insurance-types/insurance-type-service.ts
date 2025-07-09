/**
 * Sigorta Tipleri (Insurance Types) modülü için servis katmanı
 */
'use client';

import { createDefinitionService } from '@/lib/definition-service-factory';
import { InsuranceType, InsuranceTypeSchema } from './insurance-type-schema';

// Servis fabrikasından yeni servis oluşturma
const insuranceTypeService = createDefinitionService<InsuranceType>('insurance-types', InsuranceTypeSchema);

// Hook bazlı servis fonksiyonlarını dışa aktarma (exports)
export const useGetAllInsuranceTypes = insuranceTypeService.useGetAll;
export const useGetInsuranceTypeById = insuranceTypeService.useGetById;
export const useCreateInsuranceType = insuranceTypeService.useCreate;
export const useUpdateInsuranceType = insuranceTypeService.useUpdate;
export const useDeleteInsuranceType = insuranceTypeService.useDelete;

// Sayfalar için kolaylık sağlayan hook'lar
export const useAllInsuranceTypes = insuranceTypeService.useGetAll;

// Tip ihraçatı için yeniden ihraçat
export type { InsuranceType };

/**
 * Geriye dönük uyumluluk için fonksiyonlar
 * @deprecated Bu fonksiyonlar yaklaşık olarak 2.0 sürümünde kaldırılacak, lütfen
 * useGetAllInsuranceTypes ve diğer hook'ları kullanın.
 */
export const getAllInsuranceTypes = async (): Promise<InsuranceType[]> => {
  const hook = useGetAllInsuranceTypes();
  return hook.data || [];
};

export const getInsuranceTypeById = async (id: number): Promise<InsuranceType | null> => {
  const hook = useGetInsuranceTypeById(id);
  return hook.data || null;
};

export const createInsuranceType = async (data: Omit<InsuranceType, 'id' | 'created_at'>): Promise<InsuranceType> => {
  const mutation = useCreateInsuranceType();
  return mutation.mutateAsync(data);
};

export const updateInsuranceType = async (id: number, data: Omit<InsuranceType, 'id' | 'created_at'>): Promise<InsuranceType> => {
  const mutation = useUpdateInsuranceType();
  return mutation.mutateAsync({ id, data });
};

export const deleteInsuranceType = async (id: number): Promise<{ success: boolean }> => {
  const mutation = useDeleteInsuranceType();
  return mutation.mutateAsync(id);
};
