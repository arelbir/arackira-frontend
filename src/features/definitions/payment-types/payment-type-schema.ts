// Ödeme Tipi için Zod şeması
import { z } from 'zod';

export const paymentTypeSchema = z.object({
  name: z.string().min(2, 'Ödeme tipi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type PaymentTypeFormValues = z.infer<typeof paymentTypeSchema>;
