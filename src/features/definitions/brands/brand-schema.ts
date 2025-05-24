import * as z from 'zod';

export const brandSchema = z.object({
  name: z.string().min(1, 'Marka adı zorunlu'),
  description: z.string().optional()
});

export type BrandFormValues = z.infer<typeof brandSchema>;
