import { z } from 'zod';
import { apiRequest } from './api-client';
import { useAuthenticatedQuery } from './auth-api-client';

// Auth User için Zod şeması
export const AuthUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string().optional()
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

// Auth yanıtı için şema
const AuthResponseSchema = z.object({
  user: AuthUserSchema,
  token: z.string().optional()
});

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/users`;

/**
 * Kimlik doğrulama işlemleri için merkezi servis
 * Not: Auth işlemleri diğer servislerden farklı olarak token olmadan çalışır
 */
export const authService = {
  /**
   * Kullanıcı girişi
   */
  login: async (username: string, password: string): Promise<AuthUser> => {
    try {
      const data = await apiRequest<z.infer<typeof AuthResponseSchema>>({
        url: `${API_BASE}/login`,
        method: 'POST',
        body: { username, password },
        schema: AuthResponseSchema,
        requiresAuth: false // Giriş için auth gerekmez
      });
      
      // Token'i sakla (client-side)
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }
      
      return data.user;
    } catch (error: any) {
      throw new Error(error.message || 'Giriş başarısız.');
    }
  },
  
  /**
   * Kullanıcı kaydı
   */
  register: async (username: string, password: string, role?: string): Promise<AuthUser> => {
    try {
      const data = await apiRequest<z.infer<typeof AuthResponseSchema>>({
        url: `${API_BASE}/register`,
        method: 'POST',
        body: { username, password, role },
        schema: AuthResponseSchema,
        requiresAuth: false // Kayıt için auth gerekmez
      });
      
      // Token'i sakla (client-side)
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }
      
      return data.user;
    } catch (error: any) {
      throw new Error(error.message || 'Kayıt başarısız.');
    }
  },
  
  /**
   * Çıkış yapma
   */
  logout: async (): Promise<void> => {
    const api = useAuthenticatedQuery();
    
    try {
      // Çıkış işlemi için otomatik token kullan
      await api.post(`${API_BASE}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Her durumda token'i kaldır (client-side)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  },
  
  /**
   * Şifre sıfırlama talebi
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiRequest({
      url: `${API_BASE}/request-password-reset`,
      method: 'POST',
      body: { email },
      requiresAuth: false
    });
  },
  
  /**
   * Şifre sıfırlama
   */
  resetPassword: async (resetToken: string|null, newPassword: string): Promise<void> => {
    await apiRequest({
      url: `${API_BASE}/reset-password`,
      method: 'POST',
      body: { token: resetToken, newPassword },
      requiresAuth: false
    });
  },
  
  /**
   * Mevcut kullanıcı bilgisini getir
   */
  getMe: () => {
    const api = useAuthenticatedQuery<AuthUser>();
    
    return {
      queryFn: () => api.get(`${API_BASE}/me`, AuthUserSchema),
      enabled: api.isEnabled()
    };
  }
};

// Geriye dönük uyumluluk için eski fonksiyonları dışa aktar
export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;
export const requestPasswordReset = authService.requestPasswordReset;
export const resetPassword = authService.resetPassword;
export const getMe = async (token?: string | null): Promise<AuthUser | null> => {
  try {
    return await apiRequest<AuthUser>({
      url: `${API_BASE}/me`,
      schema: AuthUserSchema,
      token
    });
  } catch (error) {
    // Oturum açılmamış veya token süresi dolmuş olabilir
    return null;
  }
};
