// Para Birimi için Zod şeması
import { z } from 'zod';

export const currencySchema = z.object({
  name: z.string().min(2, 'Para birimi adı en az 2 karakter olmalı'),
  description: z.string().optional()
});

export type CurrencyFormValues = z.infer<typeof currencySchema>;
