import useSWRMutation from 'swr/mutation';
import { apiRequest } from '@/lib/api-client';

export function useDeleteResource(resourceUrl: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    resourceUrl,
    (url: string, { arg }: { arg: number }) =>
      apiRequest({ url: `${url}/${arg}`, method: 'DELETE' })
  );
  return { deleteResource: trigger, isDeleting: isMutating, error };
}
