import { z } from 'zod';
import { createService } from '@/lib/create-service';
import { ProfileFormValues } from '@/features/profile/utils/form-schema';

// Profile için Zod şeması
export const ProfileSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;

/**
 * Profil Servis Modülü
 * Merkezi servis yapısı kullanılarak oluşturulmuştur
 */
export const profileService = createService<Profile>('users', ProfileSchema);

// Profil güncelleme
export const updateProfile = async (data: ProfileFormValues): Promise<Profile> => {
  const service = profileService.updateCustomEndpoint('me');
  return service.mutationFn(data);
};

// Profil bilgilerini getir
export const getProfile = () => {
  const service = profileService.getByCustomEndpoint('me');
  return {
    queryFn: service.queryFn,
    enabled: service.enabled
  };
};
