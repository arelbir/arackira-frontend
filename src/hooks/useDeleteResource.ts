import useSWRMutation from 'swr/mutation';
import { apiFetcher } from '@/lib/api';

export function useDeleteResource(resourceUrl: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    resourceUrl,
    (url: string, { arg }: { arg: number }) =>
      apiFetcher(`${url}/${arg}`, { method: 'DELETE' })
  );
  return { deleteResource: trigger, isDeleting: isMutating, error };
}
