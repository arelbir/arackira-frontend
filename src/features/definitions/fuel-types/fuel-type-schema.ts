// Yakıt Tipi için Zod şeması
import { z } from 'zod';

export const fuelTypeSchema = z.object({
  name: z.string().min(2, 'Yakıt tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type FuelTypeFormValues = z.infer<typeof fuelTypeSchema>;
