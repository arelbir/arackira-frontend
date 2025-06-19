import useSWRMutation from 'swr/mutation';
import { apiFetcher } from '@/lib/api';

export function useRestoreResource(resourceUrl: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    resourceUrl,
    (url: string, { arg }: { arg: number }) =>
      apiFetcher(`${url}/${arg}/restore`, { method: 'POST' })
  );
  return { restoreResource: trigger, isRestoring: isMutating, error };
}
