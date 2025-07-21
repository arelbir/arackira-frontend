'use client';
import useSWRMutation from 'swr/mutation';
import { apiRequest } from '@/lib/api-client';
import { ClientCompanyFormValues } from './useClientForm';

export function useCreateClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/clients',
    (url, { arg }: { arg: ClientCompanyFormValues }) => apiRequest({ 
      url,
      method: 'POST',
      body: arg,
    })
  );

  return {
    createClient: trigger,
    isCreating: isMutating,
    error,
  };
}
