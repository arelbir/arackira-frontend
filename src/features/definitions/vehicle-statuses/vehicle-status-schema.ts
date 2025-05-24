import { z } from 'zod';

export const vehicleStatusSchema = z.object({
  name: z.string().min(2, 'Statü adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type VehicleStatusFormValues = z.infer<typeof vehicleStatusSchema>;
