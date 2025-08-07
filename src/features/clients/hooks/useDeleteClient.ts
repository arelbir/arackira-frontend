import useSWRMutation from 'swr/mutation';
import { deleteClient } from '../services/client.service';

export function useDeleteClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/clients',
    (url: string, { arg }: { arg: number }) => deleteClient(arg)
  );

  return {
    deleteClient: trigger,
    isDeleting: isMutating,
    error,
  };
}
