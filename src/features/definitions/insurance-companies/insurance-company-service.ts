/**
 * Sigorta Şirketleri (Insurance Companies) modülü için servis katmanı
 */
'use client';

import { createDefinitionService } from '../../../lib/definition-service-factory';
import { InsuranceCompany, InsuranceCompanySchema } from './insurance-company-schema';

// Servis fabrikasından yeni servis oluşturma
const insuranceCompanyService = createDefinitionService<InsuranceCompany>('insurance-companies', InsuranceCompanySchema);

// Hook bazlı servis fonksiyonlarını dışa aktarma (exports)
export const useGetAllInsuranceCompanies = insuranceCompanyService.useGetAll;
export const useGetInsuranceCompanyById = insuranceCompanyService.useGetById;
export const useCreateInsuranceCompany = insuranceCompanyService.useCreate;
export const useUpdateInsuranceCompany = insuranceCompanyService.useUpdate;
export const useDeleteInsuranceCompany = insuranceCompanyService.useDelete;

// Sayfalar için kolaylık sağlayan hook'lar
export const useAllInsuranceCompanies = insuranceCompanyService.useGetAll;

// Tüm mutasyon işlemlerini tek bir hook'ta dışa aktar
export const useInsuranceCompanyMutations = () => {
  const createMutation = useCreateInsuranceCompany();
  const updateMutation = useUpdateInsuranceCompany();
  const deleteMutation = useDeleteInsuranceCompany();
  
  return {
    addInsuranceCompany: createMutation.mutate,
    updateInsuranceCompany: updateMutation.mutate,
    deleteInsuranceCompany: deleteMutation.mutate,
    isAddingInsuranceCompany: createMutation.isPending,
    isUpdatingInsuranceCompany: updateMutation.isPending,
    isDeletingInsuranceCompany: deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error
  };
};

// Tip ihraçatı için yeniden ihraçat
export type { InsuranceCompany };

/**
 * Geriye dönük uyumluluk için fonksiyonlar
 * @deprecated Bu fonksiyonlar yaklaşık olarak 2.0 sürümünde kaldırılacak, lütfen
 * useGetAllInsuranceCompanies ve diğer hook'ları kullanın.
 */
export const getAllInsuranceCompanies = async (): Promise<InsuranceCompany[]> => {
  const hook = useGetAllInsuranceCompanies();
  return hook.data || [];
};

export const getInsuranceCompanyById = async (id: number): Promise<InsuranceCompany | null> => {
  const hook = useGetInsuranceCompanyById(id);
  return hook.data || null;
};

export const createInsuranceCompany = async (data: Omit<InsuranceCompany, 'id' | 'created_at'>): Promise<InsuranceCompany> => {
  const mutation = useCreateInsuranceCompany();
  return mutation.mutateAsync(data);
};

export const updateInsuranceCompany = async (id: number, data: Omit<InsuranceCompany, 'id' | 'created_at'>): Promise<InsuranceCompany> => {
  const mutation = useUpdateInsuranceCompany();
  return mutation.mutateAsync({ id, data });
};

export const deleteInsuranceCompany = async (id: number): Promise<{ success: boolean }> => {
  const mutation = useDeleteInsuranceCompany();
  return mutation.mutateAsync(id);
};;
