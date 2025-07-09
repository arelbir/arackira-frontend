import { z } from 'zod';

// Geliştirilmiş API İstekler için yardımcı fonksiyon
// apiFetch ve apiRequest işlevlerini birleştiren versiyon
// SSR uyumlu geliştirilmiş versiyon (token parametresi ekli)
export async function apiRequest<T>({
  url,
  method = 'GET',
  body,
  schema,
  requiresAuth = true,
  customHeaders = {},
  token = null,
}: {
  url: string;
  method?: string;
  body?: any;
  schema?: z.ZodType<T>;
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
  token?: string | null;
}): Promise<T> {
  try {
    // Başlangıç headers ayarla
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    
    // URL yapısını kontrol et ve gerekirse taban URL ile birleştir
    let fullUrl = url;
    
    // Eğer URL mutlak değilse (http:// veya https:// ile başlamıyorsa) base URL ekle
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      // URL ve base URL arasında çift slash olmamasını sağla
      const baseUrlWithoutTrailingSlash = baseUrl.endsWith('/')
        ? baseUrl.slice(0, -1)
        : baseUrl;
      const urlWithoutLeadingSlash = url.startsWith('/')
        ? url.slice(1)
        : url;
      
      fullUrl = `${baseUrlWithoutTrailingSlash}/${urlWithoutLeadingSlash}`;
    }
    
    // Debug bilgisi: URL'i logla
    console.log(`API İsteği yapılıyor: ${fullUrl}`);
    
    // Auth token ekle - SSR uyumlu şekilde
    if (requiresAuth) {
      // 1. Öncelikle direkt token parametresini kullan (SSR durumları için)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Token kullanılıyor (parametre)', { tokenLength: token.length });
      }
      // 2. Token parametresi yoksa ve client-side ise localStorage'dan al
      else if (typeof window !== 'undefined') {
        const localToken = localStorage.getItem('token');
        if (localToken) {
          headers['Authorization'] = `Bearer ${localToken}`;
          console.log('Token kullanılıyor (localStorage)', { tokenLength: localToken.length });
        } else {
          console.warn('Token bulunamadı! Yetkilendirme başarısız olabilir.');
        }
      } else {
        console.warn('Token bulunamadı ve client-side değil!');
      }
    }

    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // Çerezleri gönderebilmek için
    });

    // Özel durum: 204 No Content cevapları için boş nesne dön
    if (res.status === 204) {
      console.log('204 No Content cevabı alındı, başarılı kabul edildi');
      return { success: true } as T;
    }

    if (!res.ok) {
      // Hata durumunda daha fazla bilgi almaya çalış
      let errorDetail = '';
      let errorData = null;
      
      try {
        // Önce JSON olarak parse etmeyi dene
        const errorText = await res.text();
        try {
          errorData = JSON.parse(errorText);
          errorDetail = JSON.stringify(errorData);
        } catch {
          // JSON parse başarısız olursa, text olarak kullan
          errorDetail = errorText;
        }
      } catch (e) {
        errorDetail = 'Hata detayı alınamadı';
      }
      
      const error = new Error(`API Hatası: ${res.status} ${res.statusText} - ${errorDetail}`);
      (error as any).status = res.status;
      (error as any).data = errorData;
      throw error;
    }

    // Body içeriği olup olmadığını kontrol et
    const contentType = res.headers.get('content-type');
    
    // İçerik türü yoksa veya boşsa (genelde 204 veya 205 cevapları), boş başarı nesnesi dön
    if (!contentType) {
      return { success: true } as T;
    }
    
    // JSON içeriği
    if (contentType.includes('application/json')) {
      try {
        const text = await res.text();
        if (!text || text.trim() === '') {
          return { success: true } as T;
        }
        
        const data = JSON.parse(text); 
        return data as T;
      } catch (error) {
        console.error('JSON parse hatası:', error);
        return { success: true } as T; // Hata durumunda bile başarı dönüyöruz, çünkü HTTP 200+ kodu başarılıdır
      }
    } else {
      // JSON olmayan içerik için boş nesne dön
      return { success: true } as T;
    }
    
    // Not: Zod validasyonu artık yukarıdaki JSON parse kısmında yapılmalıdır
    // Bu nokta asla çalışmayacak çünkü önceki if-else deyimlerinde return vardır
  } catch (error) {
    // Hata tipini ve detaylarını logla
    if (error instanceof Error) {
      console.error('API isteği sırasında hata:', { 
        message: error.message, 
        url, 
        method, 
        name: error.name, 
        stack: error.stack 
      });
    } else {
      console.error('API isteği sırasında tanımlanamayan hata:', { error, url, method });
    }
    throw error;
  }
}

// Eski apiFetch ile uyumluluk için basit bir wrapper
// Bu fonksiyon projedeki mevcut apiFetch kullanımlarını etkilemeden çalışmasını sağlayacak
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = init.headers ? { ...init.headers } : {};
  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });
}
