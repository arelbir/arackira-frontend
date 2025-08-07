'use client';
import useSWRMutation from 'swr/mutation';
import { createClient } from '../services/client.service';
import { ClientCompanyFormValues } from '../schemas/client.schema';

export function useCreateClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/clients',
    (url, { arg }: { arg: ClientCompanyFormValues }) => createClient(arg)
  );

  return {
    createClient: trigger,
    isCreating: isMutating,
    error,
  };
}
