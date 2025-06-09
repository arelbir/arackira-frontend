import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { createService } from '@/lib/create-service';
import { useAuthenticatedQuery } from '@/lib/auth-api-client';

// Paket için Zod şeması
export const PackageSchema = z.object({
  id: z.number(),
  model_id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

export type VehiclePackage = z.infer<typeof PackageSchema>;

/**
 * Paket Servisi
 * Merkezi hook tabanlı servis yapısı kullanılarak güncellendi
 */
export const packageService = createService<VehiclePackage>('packages', PackageSchema);

// Hook tabanlı servis fonksiyonları
export const useGetAllPackages = packageService.useGetAll;
export const useGetPackageById = packageService.useGetById;
export const useCreatePackage = packageService.useCreate;
export const useUpdatePackage = packageService.useUpdate;
export const useDeletePackage = packageService.useDelete;

// Model bazlı paketleri getirmek için özel hook
export const useGetPackagesByModel = (modelId: number | null) => {
  const api = useAuthenticatedQuery<VehiclePackage[]>();
  
  return {
    queryFn: () => api.get(`/api/packages/by-model/${modelId}`, z.array(PackageSchema)),
    enabled: api.isEnabled() && !!modelId
  };
};

// Geriye dönük uyumluluk için
export const getAllPackages = () => {
  const hook = useGetAllPackages();
  return hook;
};

export const getPackageById = (id: number) => {
  const hook = useGetPackageById(id);
  return hook;
};

export const getPackagesByModel = (modelId: number | null) => {
  const hook = useGetPackagesByModel(modelId);
  return hook;
};
export const createPackage = () => {
  const mutation = useCreatePackage();
  return {
    mutateAsync: async (data: Omit<VehiclePackage, 'id' | 'created_at'>): Promise<VehiclePackage> => {
      return mutation.mutationFn(data);
    }
  };
};

export const updatePackage = () => {
  const mutation = useUpdatePackage();
  return {
    mutateAsync: async (id: number, data: Partial<VehiclePackage>): Promise<VehiclePackage> => {
      return mutation.mutationFn({ id, data });
    }
  };
};

export const deletePackage = () => {
  const mutation = useDeletePackage();
  return {
    mutateAsync: async (id: number): Promise<{ success: boolean }> => {
      return mutation.mutationFn(id);
    }
  };
};
