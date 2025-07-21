// src/features/vehicle/schemas/index.ts
import { z } from 'zod';

// Şemaları yeniden ihraç et
export * from './common.schemas';
export * from './included.schemas';
export * from './vehicle.schemas';

// Tipleri şemalardan türet ve ihraç et
import {
  vehicleBaseSchema,
  vehicleApiResponseSchema,
  vehicleFormValidationSchema,
} from './vehicle.schemas';

export type VehicleBase = z.infer<typeof vehicleBaseSchema>;
export type VehicleApiResponse = z.infer<typeof vehicleApiResponseSchema>;
export type VehicleFormValues = z.infer<typeof vehicleFormValidationSchema>;
