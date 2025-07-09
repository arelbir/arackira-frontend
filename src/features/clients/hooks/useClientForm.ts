import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientCompany, ClientAddress } from './useClients';
import { z } from 'zod';

export const clientAddressSchema = z.object({
  type: z.string().min(1, 'Adres tipi zorunlu'),
  address: z.string().min(1, 'Adres zorunlu'),
  city: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  tax_number: z.string().optional(),
});

export const clientCompanySchema = z.object({
  company_name: z.string().min(1, 'Şirket adı zorunlu'),
  contact_person: z.string().optional(),
  email: z.string().email('Geçerli email zorunlu'),
  phone: z.string().optional(),
  parent_company_id: z.number().int().nullable().optional(),
  client_type_id: z.number().int().nullable().optional(),
  addresses: z.array(clientAddressSchema).optional(),
});

export type ClientCompanyFormValues = z.infer<typeof clientCompanySchema>;

export function useClientForm(initial?: Partial<ClientCompanyFormValues>): UseFormReturn<ClientCompanyFormValues> {
  return useForm<ClientCompanyFormValues>({
    resolver: zodResolver(clientCompanySchema),
    defaultValues: initial ?? {},
    mode: 'onTouched',
  });
}
