import useSWRMutation from 'swr/mutation';
import { apiRequest } from '@/lib/api-client';

export function useRestoreResource(resourceUrl: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    resourceUrl,
    (url: string, { arg }: { arg: number }) =>
      apiRequest({ url: `${url}/${arg}/restore`, method: 'POST' })
  );
  return { restoreResource: trigger, isRestoring: isMutating, error };
}
