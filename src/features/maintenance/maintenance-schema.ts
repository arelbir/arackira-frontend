// Bakım formu için Zod şeması
import { z } from 'zod';

export const maintenanceSchema = z.object({
  vehicle_id: z.number(),
  description: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Bakım tarihi zorunlu ve geçerli bir tarih olmalı (YYYY-AA-GG)'
  }),
  cost: z.number().min(0),
  notes: z.string().optional()
});

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;
