import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { createService } from '@/lib/create-service';

// Transmission için Zod şeması
export const TransmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
});

export type Transmission = z.infer<typeof TransmissionSchema>;

/**
 * Şanzıman Türleri Servis Modülü
 * Merkezi hook tabanlı servis yapısı kullanılarak güncellendi
 */
export const transmissionService = createService<Transmission>('transmissions', TransmissionSchema);

// Hook tabanlı servis fonksiyonları
export const useGetAllTransmissions = transmissionService.useGetAll;
export const useGetTransmissionById = transmissionService.useGetById;
export const useCreateTransmission = transmissionService.useCreate;
export const useUpdateTransmission = transmissionService.useUpdate;
export const useDeleteTransmission = transmissionService.useDelete;

// Geriye dönük uyumluluk için
export const getAllTransmissions = () => {
  const hook = useGetAllTransmissions();
  return hook;
};

export const getTransmissionById = (id: number) => {
  const hook = useGetTransmissionById(id);
  return hook;
};
export const createTransmission = () => {
  const mutation = useCreateTransmission();
  return {
    mutateAsync: (data: Omit<Transmission, 'id' | 'created_at'>): Promise<Transmission> => {
      return Promise.resolve(mutation.mutationFn(data));
    }
  };
};

export const updateTransmission = () => {
  const mutation = useUpdateTransmission();
  return {
    mutateAsync: (id: number, data: Partial<Transmission>): Promise<Transmission> => {
      return Promise.resolve(mutation.mutationFn({ id, data }));
    }
  };
};

export const deleteTransmission = () => {
  const mutation = useDeleteTransmission();
  return {
    mutateAsync: (id: number): Promise<{ success: boolean }> => {
      return Promise.resolve(mutation.mutationFn(id));
    }
  };
};
