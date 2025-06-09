import { z, ZodType } from 'zod';
import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { createService } from './create-service';
import { useAuthenticatedQuery } from './auth-api-client';
import { useAuth } from '@/context/AuthContext';

// Servislerde kullanılacak temel api fonksiyonu
const apiRequest = async <T>(url: string, options?: any): Promise<T> => {
  let fullUrl = url;
  
  // Tam URL kontrolü (http veya https ile başlıyorsa)
  if (!url.startsWith('http')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
    // URL'leri düzgün şekilde birleştir
    if (url.startsWith('/')) {
      fullUrl = `${baseUrl}${url}`;
    } else {
      fullUrl = `${baseUrl}/${url}`;
    }
  }
  
  // Debug için URL'i logla
  console.log('API request to:', fullUrl);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {})
  };
  
  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }
  
  const response = await fetch(fullUrl, {
    ...options,
    headers
  });
  
  // Özel durum: 204 No Content durumu için boş başarı nesnesi döndür
  if (response.status === 204) {
    console.log('204 No Content cevabı alındı, başarılı kabul edildi');
    return { success: true } as T;
  }
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  // Content-Type kontrolü
  const contentType = response.headers.get('content-type');
  
  // Boş cevap kontrolü
  if (!contentType) {
    return { success: true } as T;
  }
  
  // JSON içerik kontrolü
  if (contentType.includes('application/json')) {
    try {
      const text = await response.text();
      if (!text || text.trim() === '') {
        return { success: true } as T;
      }
      
      const data = JSON.parse(text);
      return data as T;
    } catch (error) {
      console.error('JSON parse hatası:', error);
      return { success: true } as T; // Hata durumunda bile başarı dön
    }
  } else {
    // JSON olmayan cevaplar için
    return { success: true } as T;
  }
};

// Bu fonksiyon kaldırıldı, çünkü artık token doğrudan hook'lar içinde kontrol ediliyor
// function useAuthQuery<T>(options: UseQueryOptions<T, Error>) {...}

/**
 * Tanım servisleri için fabrika fonksiyonu
 * Merkezi token yönetimi ve React Query entegrasyonu sağlar
 * Hook kurallarına uygun olarak yeniden düzenlendi.
 * 
 * @param endpoint API endpoint adı
 * @param schema Veri şeması (Zod)
 * @param customOperations Özel operasyonlar (isteğe bağlı)
 * @returns Servis fonksiyonları ve React Query hooks
 */
export function createDefinitionService<T extends { id: number | string }>(
  endpoint: string,
  schema?: ZodType<any>,
  customOperations?: Record<string, any>
) {
  // Standart tanımlar servisi fonksiyonları - Hook'lar
  // React Hook kurallarına uymak için tüm fonksiyonlar use ile başlıyor
  
  // Tüm kayıtları getir - Hook
  const useGetAll = () => {
    const auth = useAuthenticatedQuery<T[]>();
    const { token } = useAuth();
    
    return useQuery<T[], Error>({
      queryFn: () => auth.get(`api/${endpoint}`),
      queryKey: [`${endpoint}-list`],
      enabled: !!token
    });
  };
  
  // ID ile kayıt getir - Hook
  const useGetById = (id: string | number | null) => {
    const auth = useAuthenticatedQuery<T>();
    const { token } = useAuth();
    
    return useQuery<T, Error>({
      queryFn: () => auth.get(`api/${endpoint}/${id}`),
      enabled: !!token && !!id,
      queryKey: [`${endpoint}-item-${id}`]
    });
  };
    
    // Yeni kayıt oluştur - Hook
    const useCreate = () => {
      const { token } = useAuth();
      
      return useMutation<T, Error, Omit<T, 'id' | 'created_at'>>({
        mutationFn: (data: Omit<T, 'id' | 'created_at'>) => {
          return apiRequest<T>(`api/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(data),
            token
          });
        }
      });
    };
    
    // Kayıt güncelle - Hook
    const useUpdate = () => {
      const { token } = useAuth();
      
      return useMutation<T, Error, { id: string | number; data: Partial<T> }>({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<T> }) => {
          return apiRequest<T>(`api/${endpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token
          });
        }
      });
    };
    
    // Kayıt sil - Hook
    const useDelete = () => {
      const { token } = useAuth();
      
      return useMutation<{ success: boolean }, Error, string | number>({
        mutationFn: (id: string | number) => {
          return apiRequest<{ success: boolean }>(`api/${endpoint}/${id}`, {
            method: 'DELETE',
            token
          });
        }
      });
    };

    // Kullanımı basitleştiren kısayollar - Hook olarak
    const useUtils = () => {
      // Tip güvenliği için utilsData nesnesini hook içinde oluştur
      const utilsData = {
        // Servis endpoint'i
        endpoint,
        // Validasyon şeması
        schema
      };
      
      return utilsData;
    };
  
  // Hook'ları dışa aktar
  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
    useUtils,
    ...customOperations
  };
}

/**
 * Tanım modülleri için adlandırılmış hook'lar oluşturan yardımcı fonksiyon
 * React Hook kurallarına uygun olarak yeniden düzenlendi
 * 
 * @param entityName Varlık adı (tekil)
 * @param service Tanım servisi
 * @returns Standart isimlendirilmiş hook'lar
 */
export function createNamedDefinitionHooks<T extends { id: number | string }>(
  service: ReturnType<typeof createDefinitionService<T>>,
  entityName: string
) {
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  
  return {
    // Örneğin: useGetModels, useGetBrands
    [`useGet${capitalizedName}s`]: () => {
      return service.useGetAll();
    },
    
    // Örneğin: useGetModelById, useGetBrandById
    [`useGet${capitalizedName}ById`]: (id: number | null) => {
      return service.useGetById(id);
    },
    
    // Örneğin: useCreateModel, useCreateBrand
    [`useCreate${capitalizedName}`]: () => {
      return service.useCreate();
    },
    
    // Örneğin: useUpdateModel, useUpdateBrand
    [`useUpdate${capitalizedName}`]: () => {
      return service.useUpdate();
    },
    
    // Örneğin: useDeleteModel, useDeleteBrand
    [`useDelete${capitalizedName}`]: () => {
      return service.useDelete();
    }
  };
}
