import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientCompanySchema, ClientCompanyFormValues } from '../schemas/client.schema';

export function useClientForm(initial?: Partial<ClientCompanyFormValues>): UseFormReturn<ClientCompanyFormValues> {
  return useForm<ClientCompanyFormValues>({
    resolver: zodResolver(clientCompanySchema),
    defaultValues: initial ?? {},
    mode: 'onTouched',
  });
}
