// Araç Tipi için Zod şeması
import { z } from 'zod';

export const vehicleTypeSchema = z.object({
  name: z.string().min(2, 'Araç tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type VehicleTypeFormValues = z.infer<typeof vehicleTypeSchema>;
