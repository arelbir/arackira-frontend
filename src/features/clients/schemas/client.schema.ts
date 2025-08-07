// Zod schemas for client validation will be here.

import { z } from 'zod';

export const clientAddressSchema = z.object({
  id: z.number().optional(),
  address_title: z.string().min(1, 'Adres başlığı zorunlu'),
  street: z.string().min(1, 'Sokak bilgisi zorunlu'),
  city: z.string().min(1, 'Şehir zorunlu'),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, 'Ülke zorunlu'),
});

export type ClientAddress = z.infer<typeof clientAddressSchema>;

export const clientCompanySchema = z.object({
  company_name: z.string().min(1, 'Şirket adı zorunlu'),
  contact_person: z.string().optional(),
  email: z.string().email('Geçerli email zorunlu'),
  phone: z.string().optional(),
  tax_id: z.string().optional(),
  description: z.string().optional(),
  parent_company_id: z.preprocess(
    (val) => (val == null || val === '' ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
  client_type_id: z.preprocess(
    (val) => (val == null || val === '' ? null : Number(val)),
    z.number().int().nullable().optional()
  ),
  addresses: z.array(clientAddressSchema).optional(),
  deleted_ids: z.object({
    addresses: z.array(z.number()).optional(),
  }).optional(),
});

export type ClientCompanyFormValues = z.infer<typeof clientCompanySchema>;
