import { z } from 'zod';
import { useAuthenticatedQuery } from './auth-api-client';

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

/**
 * Merkezi servis yapısı oluşturan yardımcı fonksiyon
 * React Hook kurallarına uygun olarak yeniden düzenlendi
 * 
 * @template T Servis verilerinin tipi
 * @param endpoint API endpoint (örn: 'vehicles', 'vehicle-types')
 * @param schema Servis verisi için Zod şeması
 * @returns Servis hook'larını içeren nesne
 */
export function createService<T extends { id: number | string }>(endpoint: string, schema: z.ZodType<T>) {
  // Endpoint'in sonunda '/' varsa kaldır
  endpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
  
  // Ana URL için tam yol
  const basePath = `${API_BASE}/api/${endpoint}`;
  
  // Alt endpoint için URL oluşturucu
  const createUrl = (path = '') => `${basePath}${path}`;
  
  // Hook fonksiyonları
  
  /**
   * Tüm kayıtları getiren React Hook
   */
  const useGetAll = () => {
    const api = useAuthenticatedQuery<T[]>();
    
    return {
      /**
       * React Query queryFn ile kullanılmak üzere
       */
      queryFn: () => api.get(createUrl(), z.array(schema)),
      
      /**
       * React Query enabled ile kullanılmak üzere
       */
      enabled: api.isEnabled()
    };
  };
  
  /**
   * Tek bir kaydı getiren React Hook
   */
  const useGetById = (id: number | string | null) => {
    const api = useAuthenticatedQuery<T>();
    
    return {
      queryFn: () => api.get(createUrl(`/${id}`), schema),
      enabled: api.isEnabled() && !!id
    };
  };
  
  /**
   * Yeni kayıt oluşturan React Hook
   */
  const useCreate = () => {
    const api = useAuthenticatedQuery<T>();
    
    return {
      mutationFn: (data: Omit<T, 'id' | 'created_at'>) => 
        api.post(createUrl(), data, schema)
    };
  };
  
  /**
   * Özel endpoint'e veri almak için React Hook
   */
  const useGetByCustomEndpoint = (customPath: string) => {
    const api = useAuthenticatedQuery<T>();
    
    return {
      queryFn: () => api.get(createUrl(`/${customPath}`), schema),
      enabled: api.isEnabled() && !!customPath
    };
  };
  
  /**
   * Özel endpoint'e veri göndermek için React Hook
   */
  const useUpdateCustomEndpoint = (customPath: string) => {
    const api = useAuthenticatedQuery<T>();
    
    return {
      mutationFn: (data: any) => 
        api.put(createUrl(`/${customPath}`), data, schema)
    };
  };
  
  /**
   * Kayıt güncelleyen React Hook
   */
  const useUpdate = () => {
    const api = useAuthenticatedQuery<T>();
    
    return {
      mutationFn: ({ id, data }: { id: number | string, data: Partial<T> }) => 
        api.put(createUrl(`/${id}`), data, schema)
    };
  };
  
  /**
   * Kayıt silen React Hook
   */
  const useDelete = () => {
    const api = useAuthenticatedQuery<{ success: boolean }>();
    
    return {
      mutationFn: (id: number | string) => 
        api.delete(createUrl(`/${id}`))
    };
  };

  // Tüm hook'ları dışa aktar
  return {
    // Yeni hook tabanlı API
    useGetAll,
    useGetById,
    useCreate,
    useGetByCustomEndpoint,
    useUpdateCustomEndpoint,
    useUpdate,
    useDelete,
    
    // Geriye dönük uyumluluk için eski API'yi taklit eden fonksiyonlar
    getAll: useGetAll,
    getById: useGetById,
    create: useCreate,
    getByCustomEndpoint: useGetByCustomEndpoint,
    updateCustomEndpoint: useUpdateCustomEndpoint,
    update: useUpdate,
    delete: useDelete
  };
}
