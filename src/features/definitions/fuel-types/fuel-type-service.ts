/**
 * Yakıt Tipleri (Fuel Types) modülü için servis katmanı
 */
'use client';

import { createDefinitionService } from '@/lib/definition-service-factory';
import { FuelType, FuelTypeSchema } from './fuel-type-schema';

// Servis fabrikasından yeni servis oluşturma
const fuelTypeService = createDefinitionService<FuelType>('fuel-types', FuelTypeSchema);

// Hook bazlı servis fonksiyonlarını dışa aktarma (exports)
export const useGetAllFuelTypes = fuelTypeService.useGetAll;
export const useGetFuelTypeById = fuelTypeService.useGetById;
export const useCreateFuelType = fuelTypeService.useCreate;
export const useUpdateFuelType = fuelTypeService.useUpdate;
export const useDeleteFuelType = fuelTypeService.useDelete;

// Tip ihraçatı için yeniden ihraçat
export type { FuelType };

/**
 * Geriye dönük uyumluluk için fonksiyonlar
 * @deprecated Bu fonksiyonlar yaklaşık olarak 2.0 sürümünde kaldırılacak, lütfen
 * useGetAllFuelTypes ve diğer hook'ları kullanın.
 */
export const getAllFuelTypes = async (): Promise<FuelType[]> => {
  const hook = useGetAllFuelTypes();
  return hook.data || [];
};

export const getFuelTypeById = async (id: number): Promise<FuelType | null> => {
  const hook = useGetFuelTypeById(id);
  return hook.data || null;
};

export const createFuelType = async (data: Omit<FuelType, 'id' | 'created_at'>): Promise<FuelType> => {
  const mutation = useCreateFuelType();
  return mutation.mutateAsync(data);
};

export const updateFuelType = async (id: number, data: Partial<FuelType>): Promise<FuelType> => {
  const mutation = useUpdateFuelType();
  return mutation.mutateAsync({ id, data });
};

export const deleteFuelType = async (id: number): Promise<void> => {
  const mutation = useDeleteFuelType();
  return mutation.mutateAsync(id);
};
