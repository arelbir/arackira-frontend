import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { createService } from '@/lib/create-service';

// Branch için Zod şeması
export const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string().optional()
});

export type Branch = z.infer<typeof BranchSchema>;

/**
 * Şube Servisi
 * Merkezi hook tabanlı servis yapısı kullanılarak güncellendi
 */
export const branchService = createService<Branch>('branches', BranchSchema);

// Hook tabanlı servis fonksiyonları
export const useGetAllBranches = branchService.useGetAll;
export const useGetBranchById = branchService.useGetById;
export const useCreateBranch = branchService.useCreate;
export const useUpdateBranch = branchService.useUpdate;
export const useDeleteBranch = branchService.useDelete;

// Geriye dönük uyumluluk için
export const getAllBranches = () => {
  const hook = useGetAllBranches();
  return hook;
};

export const getBranchById = (id: number) => {
  const hook = useGetBranchById(id);
  return hook;
};
export const createBranch = () => {
  const mutation = useCreateBranch();
  return {
    mutateAsync: async (data: Omit<Branch, 'id' | 'created_at'>): Promise<Branch> => {
      return mutation.mutationFn(data);
    }
  };
};

export const updateBranch = () => {
  const mutation = useUpdateBranch();
  return {
    mutateAsync: async (id: number, data: Partial<Branch>): Promise<Branch> => {
      return mutation.mutationFn({ id, data });
    }
  };
};

export const deleteBranch = () => {
  const mutation = useDeleteBranch();
  return {
    mutateAsync: async (id: number): Promise<{ success: boolean }> => {
      return mutation.mutationFn(id);
    }
  };
};
