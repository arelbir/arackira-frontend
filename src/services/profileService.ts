// src/services/profileService.ts
import { ProfileFormValues } from '@/features/profile/utils/form-schema';

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/users`;

export async function updateProfile(data: ProfileFormValues) {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Profil güncellenemedi.');
  return result;
}
