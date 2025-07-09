import useSWRMutation from 'swr/mutation';
import { apiFetcher } from '@/lib/api';

export function useRestoreClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/clients',
    (url: string, { arg }: { arg: number }) => apiFetcher(`/api/clients/${arg}/restore`, { method: 'POST' })
  );

  return {
    restoreClient: trigger,
    isRestoring: isMutating,
    error,
  };
}
