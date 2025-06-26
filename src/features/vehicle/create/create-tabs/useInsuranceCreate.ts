import useSWRMutation from 'swr/mutation';
import { toast } from 'sonner';

async function createInsurancesFetcher(
  url: string,
  { arg }: { arg: { vehicle_id: number; insurances: any[] } }
) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Sigorta kayıtları eklenemedi');
  }
  return res.json();
}

export function useInsuranceCreate() {
  const { trigger, isMutating } = useSWRMutation(
    '/api/insurance/bulk',
    createInsurancesFetcher,
    {
      onSuccess: () => {
        toast.success('Sigorta kayıtları başarıyla eklendi');
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    }
  );

  return { createInsurances: trigger, creating: isMutating };
}
