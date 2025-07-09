// Müşteri tipleri servisi - React Query ile entegre edilmiş
import { createDefinitionService } from '@/lib/definition-service-factory';
import { ClientTypeSchema, ClientType } from './client-type-schema';
import { z } from 'zod';

/**
 * Müşteri Tipi Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri artık hook tabanlı (use- prefix ile)
 */
export const clientTypeService = createDefinitionService<ClientType>('client-types', ClientTypeSchema);

// Tüm servis hook'larını dışa aktar
export const useGetAllClientTypes = clientTypeService.useGetAll;
export const useGetClientTypeById = clientTypeService.useGetById;
export const useCreateClientType = clientTypeService.useCreate;
export const useUpdateClientType = clientTypeService.useUpdate;
export const useDeleteClientType = clientTypeService.useDelete;
export const useClientTypeUtils = clientTypeService.useUtils;

// Kolay kullanım için kısaltmalar (sayfa komponentinin kolay geçişi için)
// Hook kurallarına uygun olarak bunları fonksiyon sarmalayıcıları olarak tanımlıyoruz
export const getAllClientTypes = () => {
  const hook = useGetAllClientTypes();
  return hook;
};

export const getClientTypeById = (id: string | number | null) => {
  const hook = useGetClientTypeById(id);
  return hook;
};

export const createClientType = (data: Omit<ClientType, 'id' | 'created_at'>) => {
  const hook = useCreateClientType();
  return hook.mutateAsync(data);
};

export const updateClientType = (id: string | number, data: Partial<ClientType>) => {
  const hook = useUpdateClientType();
  return hook.mutateAsync({ id, data });
};

export const deleteClientType = (id: string | number) => {
  const hook = useDeleteClientType();
  return hook.mutateAsync(id);
};
