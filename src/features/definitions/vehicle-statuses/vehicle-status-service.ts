import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { createService } from '@/lib/create-service';

// VehicleStatus için Zod şeması
export const VehicleStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  created_at: z.string().optional()
});

export type VehicleStatus = z.infer<typeof VehicleStatusSchema>;

/**
 * Araç Durumları Servisi
 * Merkezi hook tabanlı servis yapısı kullanılarak güncellendi
 */
export const vehicleStatusService = createService<VehicleStatus>('vehicle-statuses', VehicleStatusSchema);

// Hook tabanlı servis fonksiyonları
export const useGetAllVehicleStatuses = vehicleStatusService.useGetAll;
export const useGetVehicleStatusById = vehicleStatusService.useGetById;
export const useCreateVehicleStatus = vehicleStatusService.useCreate;
export const useUpdateVehicleStatus = vehicleStatusService.useUpdate;
export const useDeleteVehicleStatus = vehicleStatusService.useDelete;

// Geriye dönük uyumluluk için
export const getAllVehicleStatuses = () => {
  const hook = useGetAllVehicleStatuses();
  return hook;
};

export const getVehicleStatusById = (id: number) => {
  const hook = useGetVehicleStatusById(id);
  return hook;
};
export const createVehicleStatus = () => {
  const mutation = useCreateVehicleStatus();
  return {
    mutateAsync: async (data: Omit<VehicleStatus, 'id' | 'created_at'>): Promise<VehicleStatus> => {
      return mutation.mutationFn(data);
    }
  };
};

export const updateVehicleStatus = () => {
  const mutation = useUpdateVehicleStatus();
  return {
    mutateAsync: async (params: { id: number, data: Partial<VehicleStatus> }): Promise<VehicleStatus> => {
      return mutation.mutationFn(params);
    }
  };
};

export const deleteVehicleStatus = () => {
  const mutation = useDeleteVehicleStatus();
  return {
    mutateAsync: async (id: number): Promise<{ success: boolean }> => {
      return mutation.mutationFn(id);
    }
  };
};

