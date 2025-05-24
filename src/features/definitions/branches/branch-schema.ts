// Şube formu için Zod şeması
import { z } from 'zod';

export const branchSchema = z.object({
  name: z.string().min(2, 'Şube adı zorunlu ve en az 2 karakter olmalı'),
  address: z.string().optional(),
  phone: z.string().optional()
});

export type BranchFormValues = z.infer<typeof branchSchema>;
