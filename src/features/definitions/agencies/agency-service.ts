// Yeni hook tabanlı mimari için güncellendi
import { useQuery } from '@tanstack/react-query';
import { createDefinitionService } from '@/lib/definition-service-factory';
import { AgencySchema, Agency } from './agency-schema';
import { useAuth } from '@/context/AuthContext';

/**
 * Agency Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri artık hook tabanlı (use- prefix ile)
 */
export const agencyService = createDefinitionService<Agency>('agencies', AgencySchema);

// Tüm servis hook'larını dışa aktar
export const useGetAllAgencies = agencyService.useGetAll;
export const useGetAgencyById = agencyService.useGetById;
export const useCreateAgency = agencyService.useCreate;
export const useUpdateAgency = agencyService.useUpdate;
export const useDeleteAgency = agencyService.useDelete;
export const useAgencyUtils = agencyService.useUtils;

// Kolay kullanım için kısaltmalar (sayfa komponentinin kolay geçişi için)
// Hook kurallarına uygun olarak bunları fonksiyon sarmalayıcıları olarak tanımlıyoruz
export const getAllAgencies = () => {
  const hook = useGetAllAgencies();
  return hook;
};

export const getAgencyById = (id: string | number | null) => {
  const hook = useGetAgencyById(id);
  return hook;
};

export const createAgency = (data: Omit<Agency, 'id' | 'created_at'>) => {
  const hook = useCreateAgency();
  return hook.mutateAsync(data);
};

export const updateAgency = (id: string | number, data: Partial<Agency>) => {
  const hook = useUpdateAgency();
  return hook.mutateAsync({ id, data });
};

export const deleteAgency = (id: string | number) => {
  const hook = useDeleteAgency();
  return hook.mutateAsync(id);
};
