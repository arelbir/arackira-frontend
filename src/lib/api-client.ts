

// Geliştirilmiş API İstekler için yardımcı fonksiyon
// apiFetch ve apiRequest işlevlerini birleştiren versiyon
// SSR uyumlu geliştirilmiş versiyon (token parametresi ekli)
export async function apiRequest<T>({
  url,
  method = 'GET',
  body,
  requiresAuth = true,
  customHeaders = {},
  token = null,
}: {
  url: string | any[]; // SWR'dan gelen dizi key'leri desteklemek için any[] eklendi
  method?: string;
  body?: any;
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
  token?: string | null;
}): Promise<T> {
  // SWR'dan gelen key array ise ilk elemanını URL olarak al
  const actualUrl = (Array.isArray(url) ? url[0] : url) as string;

  try {
    // URL'in string olup olmadığını kontrol et
    if (typeof actualUrl !== 'string' || !actualUrl) {
      const error = new Error('Geçersiz URL formatı. URL bir string olmalıdır.');
      throw error;
    }

    // Başlangıç headers ayarla
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    
    // URL yapısını kontrol et ve gerekirse taban URL ile birleştir
    let fullUrl = actualUrl;
    
    // Eğer URL mutlak değilse (http:// veya https:// ile başlamıyorsa) base URL ekle
    if (!actualUrl.startsWith('http://') && !actualUrl.startsWith('https://')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      // URL ve base URL arasında çift slash olmamasını sağla
      const baseUrlWithoutTrailingSlash = baseUrl.endsWith('/')
        ? baseUrl.slice(0, -1)
        : baseUrl;
      
      // URL'e /api/ prefix'i ekle (eğer yoksa)
      let apiPath = actualUrl;
      if (!actualUrl.startsWith('/api/') && !actualUrl.startsWith('api/')) {
        apiPath = actualUrl.startsWith('/') ? `/api${actualUrl}` : `api/${actualUrl}`;
      }
      
      const urlWithoutLeadingSlash = apiPath.startsWith('/')
        ? apiPath.slice(1)
        : apiPath;
      
      fullUrl = `${baseUrlWithoutTrailingSlash}/${urlWithoutLeadingSlash}`;
    }
    
    // Auth token ekle - SSR uyumlu şekilde
    if (requiresAuth) {
      // 1. Öncelikle direkt token parametresini kullan (SSR durumları için)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // 2. Token parametresi yoksa ve client-side ise localStorage'dan al
      else if (typeof window !== 'undefined') {
        const localToken = localStorage.getItem('token');
        if (localToken) {
          headers['Authorization'] = `Bearer ${localToken}`;
        }
      } else {
        // 3. Client-side değilse (SSR/RSC), next/headers'dan cookie'yi okumayı dene
        try {
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          const serverToken = cookieStore.get('token')?.value;

          if (serverToken) {
            headers['Authorization'] = `Bearer ${serverToken}`;
          }
        } catch (error) {

        }
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
      return { success: true } as T;
    }

    if (!res.ok) {
      // Yetkilendirme hatası (401/403) durumunda kullanıcıyı login'e yönlendir
      if ((res.status === 401 || res.status === 403) && typeof window !== 'undefined' && window.location.pathname !== '/auth/sign-in') {
        localStorage.removeItem('token');
        window.location.href = '/auth/sign-in?session_expired=true';
        // Bu noktadan sonra kodun devam etmemesi için bir promise döndürerek beklet
        return new Promise(() => {});
      }

      // Hata durumunda daha fazla bilgi almaya çalış
      let errorToThrow: Error;
      try {
        const errorData = await res.json();
        const errorMessage = errorData.message || JSON.stringify(errorData) || res.statusText;
        errorToThrow = new Error(errorMessage);
        (errorToThrow as any).data = errorData;
      } catch (jsonError) {
        const errorText = await res.text();
        errorToThrow = new Error(errorText || res.statusText);
      }

      (errorToThrow as any).status = res.status;
      throw errorToThrow;
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
        // JSON parse hatası durumunda bile başarı dönüyoruz, çünkü HTTP 200+ kodu başarılıdır
        return { success: true } as T;
      }
    } else {
      // JSON olmayan içerik için boş nesne dön
      return { success: true } as T;
    }
    
    // Not: Zod validasyonu artık yukarıdaki JSON parse kısmında yapılmalıdır
    // Bu nokta asla çalışmayacak çünkü önceki if-else deyimlerinde return vardır
  } catch (error) {
    // Hataları yeniden fırlat
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
