import useSWRMutation from 'swr/mutation';
import { apiRequest } from '@/lib/api-client';

export function useRestoreClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/clients',
    (url: string, { arg }: { arg: number }) => apiRequest({ url: `/api/clients/${arg}/restore`, method: 'POST' })
  );

  return {
    restoreClient: trigger,
    isRestoring: isMutating,
    error,
  };
}
