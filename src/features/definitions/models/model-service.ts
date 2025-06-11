// Yeni hook tabanlı mimari için güncellendi
import { useQuery } from '@tanstack/react-query';
import { createDefinitionService } from '@/lib/definition-service-factory';
import { ModelSchema, Model } from './model-schema';
import { useAuth } from '@/context/AuthContext';

/**
 * Model Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri artık hook tabanlı (use- prefix ile)
 */
export const modelService = createDefinitionService<Model>('models', ModelSchema);

// Özel servis fonksiyonu: Marka bazlı modelleri getir (hook olarak yeniden yazıldı)
export const useModelsByBrand = (brandId: number | null) => {
  const { token } = useAuth();
  
  return useQuery<Model[], Error>({
    queryKey: ['models-by-brand', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      
      // apiRequest fonksiyonu gibi base URL ön eki eklemesi için herhangi bir ön ek belirtmiyoruz
      // bu şekilde apiRequest'in kendi URL oluşturma mantığını kullanacağız
      const url = `api/models/by-brand/${brandId}`;
      
      console.log('Models by brand request URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!token && !!brandId
  });
};

// Tüm servis hook'larını dışa aktar
export const useGetAllModels = modelService.useGetAll;
export const useGetModelById = modelService.useGetById;
export const useCreateModel = modelService.useCreate;
export const useUpdateModel = modelService.useUpdate;
export const useDeleteModel = modelService.useDelete;
export const useModelUtils = modelService.useUtils;

// Kolay kullanım için kısaltmalar (sayfa komponentinin kolay geçişi için)
// Hook kurallarına uygun olarak bunları fonksiyon sarmalayıcıları olarak tanımlıyoruz
export const getAllModels = () => {
  const hook = useGetAllModels();
  return hook;
};

export const getModelById = (id: string | number | null) => {
  const hook = useGetModelById(id);
  return hook;
};

export const createModel = (data: Omit<Model, 'id' | 'created_at'>) => {
  const hook = useCreateModel();
  return hook.mutateAsync(data);
};

export const updateModel = (id: string | number, data: Partial<Model>) => {
  const hook = useUpdateModel();
  return hook.mutateAsync({ id, data });
};

export const deleteModel = (id: string | number) => {
  const hook = useDeleteModel();
  return hook.mutateAsync(id);
};
