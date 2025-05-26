// Ödeme Hesabı için Zod şeması
import { z } from 'zod';

export const paymentAccountSchema = z.object({
  name: z.string().min(2, 'Ödeme hesabı adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type PaymentAccountFormValues = z.infer<typeof paymentAccountSchema>;
