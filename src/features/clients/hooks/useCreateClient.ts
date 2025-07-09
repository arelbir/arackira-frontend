'use client';
import useSWRMutation from 'swr/mutation';
import { apiFetcher } from '@/lib/api';
import { ClientCompanyFormValues } from './useClientForm';

export function useCreateClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/clients',
    (url, { arg }: { arg: ClientCompanyFormValues }) => apiFetcher(url, {
      method: 'POST',
      body: JSON.stringify(arg),
    })
  );

  return {
    createClient: trigger,
    isCreating: isMutating,
    error,
  };
}
