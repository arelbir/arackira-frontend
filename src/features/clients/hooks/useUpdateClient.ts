import useSWRMutation from 'swr/mutation';
import { updateClient } from '../services/client.service';
import type { ClientCompanyFormValues } from '../schemas/client.schema';

export function useUpdateClient(id: number) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/clients/${id}`,
    (url: string, { arg }: { arg: ClientCompanyFormValues }) => updateClient(id, arg)
  );

  return {
    updateClient: trigger,
    isUpdating: isMutating,
    error,
  };
}
