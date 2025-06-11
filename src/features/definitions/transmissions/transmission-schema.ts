// Vites Tipi için Zod şeması
import { z } from 'zod';

export const transmissionSchema = z.object({
  name: z.string().min(2, 'Vites tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type TransmissionFormValues = z.infer<typeof transmissionSchema>;
