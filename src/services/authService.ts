// src/services/authService.ts
import { z } from 'zod';
import { apiRequest } from '@/lib/api-client';

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

export async function login(
  username: string,
  password: string
): Promise<AuthUser> {
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
}

export async function register(
  username: string,
  password: string,
  role?: string
): Promise<AuthUser> {
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
}

export async function logout(token?: string | null): Promise<void> {
  try {
    await apiRequest({
      url: `${API_BASE}/logout`,
      method: 'POST',
      token
    });
    
    // Token'i kaldır (client-side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Çıkış yaparken hata olsa bile token'i kaldır
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest({
    url: `${API_BASE}/request-password-reset`,
    method: 'POST',
    body: { email },
    requiresAuth: false
  });
}

export async function resetPassword(resetToken: string|null, newPassword: string): Promise<void> {
  await apiRequest({
    url: `${API_BASE}/reset-password`,
    method: 'POST',
    body: { token: resetToken, newPassword },
    requiresAuth: false
  });
}

export async function getMe(token?: string | null): Promise<AuthUser | null> {
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
}
