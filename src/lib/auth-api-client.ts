import { z } from 'zod';
import { apiRequest } from './api-client';
import { useAuth } from '@/context/AuthContext';

/**
 * AuthContext'i kullanan ve token yönetimini otomatikleştiren API istek fonksiyonları
 * React Query ile kullanım için optimize edilmiştir
 */

/**
 * Yetkilendirme gerektiren GET isteği için merkezi yardımcı fonksiyon
 * @template T dönüş veri tipi
 * @param url API URL'i
 * @param schema Zod şeması (opsiyonel)
 * @returns Promise<T> tipinde veri
 * 
 * Bu fonksiyon, useAuth hook'u aracılığıyla mevcut token'ı alarak
 * API isteğine otomatik olarak ekler
 */
// Hook kullanarak authenticate edilmiş istekler yapmak için
export function useAuthenticatedQuery<T>() {
  const { token } = useAuth();
  
  return {
    /**
     * GET isteği gönderir
     */
    get: async (url: string, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'GET',
        schema,
        token
      });
    },
    
    /**
     * POST isteği gönderir
     */
    post: async (url: string, data: any, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'POST',
        body: data,
        schema,
        token
      });
    },
    
    /**
     * PUT isteği gönderir
     */
    put: async (url: string, data: any, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'PUT',
        body: data,
        schema,
        token
      });
    },
    
    /**
     * DELETE isteği gönderir
     */
    delete: async (url: string, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'DELETE',
        schema,
        token
      });
    },
    
    /**
     * API isteği için token hazır mı kontrolü yapar
     * React Query'nin enabled seçeneği için kullanılabilir
     */
    isEnabled: () => !!token
  };
}

/**
 * Komponent dışında kullanım için non-hook API istemcisi
 * Bu fonksiyon bir hook değildir ve herhangi bir yerde çağrılabilir
 * NOT: Bu fonksiyon token'ı localStorage'dan manuel olarak alır 
 */
export function getAuthenticatedApiClient<T>(manualToken?: string) {
  // Token'ı localStorage'dan al veya manualToken parametresini kullan
  const getLocalToken = () => {
    if (manualToken) return manualToken;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  };
  
  const token = getLocalToken();
  
  return {
    /**
     * GET isteği gönderir
     */
    get: async (url: string, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'GET',
        schema,
        token
      });
    },
    
    /**
     * POST isteği gönderir
     */
    post: async (url: string, data: any, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'POST',
        body: data,
        schema,
        token
      });
    },
    
    /**
     * PUT isteği gönderir
     */
    put: async (url: string, data: any, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'PUT',
        body: data,
        schema,
        token
      });
    },
    
    /**
     * DELETE isteği gönderir
     */
    delete: async (url: string, schema?: z.ZodType<T>) => {
      return apiRequest<T>({
        url,
        method: 'DELETE',
        schema,
        token
      });
    },
    
    /**
     * Token var mı kontrolü 
     */
    isEnabled: () => !!token
  };
}
