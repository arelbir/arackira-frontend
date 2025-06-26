import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { createService } from '@/lib/create-service';

// VehicleType için Zod şeması
export const VehicleTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  created_at: z.string()
});

export type VehicleType = z.infer<typeof VehicleTypeSchema>;

/**
 * Araç Tipleri Servis Modülü
 * Merkezi hook tabanlı servis yapısı kullanılarak güncellendi
 */
export const vehicleTypeService = createService<VehicleType>('vehicle-types', VehicleTypeSchema);

// Hook tabanlı servis fonksiyonları
export const useGetAllVehicleTypes = vehicleTypeService.useGetAll;
export const useGetVehicleTypeById = vehicleTypeService.useGetById;
export const useCreateVehicleType = vehicleTypeService.useCreate;
export const useUpdateVehicleType = vehicleTypeService.useUpdate;
export const useDeleteVehicleType = vehicleTypeService.useDelete;

// Geriye dönük uyumluluk için
export const getAllVehicleTypes = () => {
  const hook = useGetAllVehicleTypes();
  return hook;
};

export const getVehicleTypeById = (id: number) => {
  const hook = useGetVehicleTypeById(id);
  return hook;
};

// Mutation fonksiyonları için uyumluluk katmanı
export const createVehicleType = () => {
  const mutation = useCreateVehicleType();
  return {
    mutateAsync: (data: Omit<VehicleType, 'id' | 'created_at'>) => {
      return Promise.resolve(mutation.mutationFn(data));
    }
  };
};

export const updateVehicleType = () => {
  const mutation = useUpdateVehicleType();
  return {
    mutateAsync: (id: number, data: Partial<VehicleType>) => {
      return Promise.resolve(mutation.mutationFn({ id, data }));
    }
  };
};

export const deleteVehicleType = () => {
  const mutation = useDeleteVehicleType();
  return {
    mutateAsync: (id: number) => {
      return Promise.resolve(mutation.mutationFn(id));
    }
  };
};
