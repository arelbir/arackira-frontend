import { z } from 'zod';

export const packageSchema = z.object({
  id: z.number().optional(),
  model_id: z.number({ required_error: 'Model seçimi zorunlu' }),
  name: z.string().min(2, 'En az 2 karakter'),
  description: z.string().optional(),
  created_at: z.string().optional(),
});

export type PackageFormValues = z.infer<typeof packageSchema>;
