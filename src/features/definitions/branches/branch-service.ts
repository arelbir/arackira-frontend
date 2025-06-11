// Yeni hook tabanlı mimari için güncellendi
import { useQuery } from '@tanstack/react-query';
import { createDefinitionService } from '@/lib/definition-service-factory';
import { BranchSchema, Branch } from './branch-schema';
import { useAuth } from '@/context/AuthContext';

/**
 * Branch Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri artık hook tabanlı (use- prefix ile)
 */
export const branchService = createDefinitionService<Branch>('branches', BranchSchema);

// Tüm servis hook'larını dışa aktar
export const useGetAllBranches = branchService.useGetAll;
export const useGetBranchById = branchService.useGetById;
export const useCreateBranch = branchService.useCreate;
export const useUpdateBranch = branchService.useUpdate;
export const useDeleteBranch = branchService.useDelete;
export const useBranchUtils = branchService.useUtils;

// Kolay kullanım için kısaltmalar (sayfa komponentinin kolay geçişi için)
// Hook kurallarına uygun olarak bunları fonksiyon sarmalayıcıları olarak tanımlıyoruz
export const getAllBranches = () => {
  const hook = useGetAllBranches();
  return hook;
};

export const getBranchById = (id: string | number | null) => {
  const hook = useGetBranchById(id);
  return hook;
};

export const createBranch = (data: Omit<Branch, 'id' | 'created_at'>) => {
  const hook = useCreateBranch();
  return hook.mutateAsync(data);
};

export const updateBranch = (id: string | number, data: Partial<Branch>) => {
  const hook = useUpdateBranch();
  return hook.mutateAsync({ id, data });
};

export const deleteBranch = (id: string | number) => {
  const hook = useDeleteBranch();
  return hook.mutateAsync(id);
};
