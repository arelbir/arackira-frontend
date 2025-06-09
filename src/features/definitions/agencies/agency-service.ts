import { createDefinitionService } from '@/lib/definition-service-factory';
import { AgencySchema, Agency } from './agency-schema';

/**
 * Ajans Servisi
 * Merkezi hook-tabanlı tanım servisi yapısını kullanır
 */
export const agencyService = createDefinitionService<Agency>('agencies', AgencySchema);

/**
 * React Query Hook'ları
 * Tanım servisi fabrikasından oluşturulan hook'lar
 */
export const {  
  useGetAll: useGetAllAgencies,
  useGetById: useGetAgencyById,
  useCreate: useCreateAgency,
  useUpdate: useUpdateAgency,
  useDelete: useDeleteAgency,
  useUtils: useAgencyUtils
} = createDefinitionService<Agency>('agencies', AgencySchema);

/**
 * Named Definition Hooks
 * Diğer modüllerdeki gibi aynı format
 */
export const namedHooks = {
  useGetAll: useGetAllAgencies,
  useGetById: useGetAgencyById,
  useCreate: useCreateAgency,
  useUpdate: useUpdateAgency,
  useDelete: useDeleteAgency,
  useUtils: useAgencyUtils
};

// Export all named hooks for consistent usage across definition modules
export { namedHooks as useAgencyHooks };
