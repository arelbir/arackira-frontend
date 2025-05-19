import * as z from 'zod';

export const customerSchema = z.object({
  company_name: z.string().min(2, 'Firma adı en az 2 karakter olmalı'),
  contact_person: z.string().min(2, 'Yetkili kişi adı en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  phone: z.string().min(10, 'Telefon en az 10 karakter olmalı'),
  address: z.string().min(3, 'Adres en az 3 karakter olmalı')
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
