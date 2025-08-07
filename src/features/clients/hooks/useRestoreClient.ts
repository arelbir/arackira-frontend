import useSWRMutation from 'swr/mutation';
import { restoreClient } from '../services/client.service';

export function useRestoreClient() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/clients',
    (url: string, { arg }: { arg: number }) => restoreClient(arg)
  );

  return {
    restoreClient: trigger,
    isRestoring: isMutating,
    error,
  };
}
