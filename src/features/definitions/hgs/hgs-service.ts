// HGS Tanım Servisi (React Query uyumlu)
import { createDefinitionService } from '@/lib/definition-service-factory';
import { HGSSchema, HGS } from './hgs-schema';

/**
 * HGS Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri hook tabanlı (use- prefix ile)
 */
export const hgsService = createDefinitionService<HGS>('hgs', HGSSchema);

// Tüm servis hook'larını dışa aktar
export const useGetAllHGS = hgsService.useGetAll;
export const useGetHGSById = hgsService.useGetById;
export const useCreateHGS = hgsService.useCreate;
export const useUpdateHGS = hgsService.useUpdate;
export const useDeleteHGS = hgsService.useDelete;
export const useHGSUtils = hgsService.useUtils;

// Kolay kullanım için kısaltmalar (sayfa komponentinin kolay geçişi için)
export const getAllHGS = () => {
  const hook = useGetAllHGS();
  return hook;
};
export const getHGSById = (id: string | number | null) => {
  const hook = useGetHGSById(id);
  return hook;
};
export const createHGS = (data: Omit<HGS, 'id' | 'created_at' | 'updated_at'>) => {
  const hook = useCreateHGS();
  return hook;
};
export const updateHGS = (id: string | number, data: Partial<HGS>) => {
  const hook = useUpdateHGS();
  return hook;
};
export const deleteHGS = (id: string | number) => {
  const hook = useDeleteHGS();
  return hook;
};
