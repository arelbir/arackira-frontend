/**
 * Yakıt Tipleri (Fuel Types) modülü için servis katmanı
 * Merkezi definition-service-factory kullanılarak oluşturulmuştur
 */

import { createDefinitionService, createNamedDefinitionHooks } from '@/lib/definition-service-factory';
import { FuelType, FuelTypeSchema } from './fuel-type-schema';

// Servis fabrikasından yeni servis oluşturma
const fuelTypeService = createDefinitionService<FuelType>('fuel-types', FuelTypeSchema);

// Hook bazlı servis fonksiyonlarını dışa aktarma (exports)
export const useGetAllFuelTypes = fuelTypeService.useGetAll;
export const useGetFuelTypeById = fuelTypeService.useGetById;
export const useCreateFuelType = fuelTypeService.useCreate;
export const useUpdateFuelType = fuelTypeService.useUpdate;
export const useDeleteFuelType = fuelTypeService.useDelete;

// Adlandırılmış hook'ları oluşturma
export const {
  useAll: useFuelTypes,
  useById: useFuelTypeById,
  useCreate: useCreateFuelTypeHook,
  useUpdate: useUpdateFuelTypeHook,
  useDelete: useDeleteFuelTypeHook
} = createNamedDefinitionHooks(fuelTypeService, 'fuelType');

// Tip ihracatı için yeniden ihracat
export type { FuelType };

// Geriye dönük uyumluluk için
export const getAllFuelTypes = () => {
  const hook = useGetAllFuelTypes();
  return hook;
};

export const getFuelTypeById = (id: number) => {
  const hook = useGetFuelTypeById(id);
  return hook;
};

// Geriye dönük uyumluluk için export edilen fonksiyonları mutateAsync kullanarak düzeltiyoruz
export const createFuelType = () => {
  const mutation = useCreateFuelType();
  return {
    mutateAsync: async (data: Omit<FuelType, 'id' | 'created_at'>): Promise<FuelType> => {
      return mutation.mutateAsync(data);
    }
  };
};

export const updateFuelType = () => {
  const mutation = useUpdateFuelType();
  return {
    mutateAsync: async (id: number, data: Partial<FuelType>): Promise<FuelType> => {
      return mutation.mutateAsync({ id, data });
    }
  };
};

export const deleteFuelType = () => {
  const mutation = useDeleteFuelType();
  return {
    mutateAsync: async (id: number): Promise<unknown> => {
      return mutation.mutateAsync(id);
    } 
  };
};
