import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { VehicleCreateInput } from './schema';

import { apiFetcher } from '@/lib/api';

// Draft creation (POST, returns id)
async function createDraftFetcher(arg: { chassis_number: string; is_draft: boolean }) {
  return apiFetcher('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify({
      chassis_number: arg.chassis_number,
      is_draft: true
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}

// Full update (PUT by id)
async function updateVehicleFetcher(vehicleId: number, arg: VehicleCreateInput) {
  return apiFetcher(`/api/vehicles/${vehicleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
}

export function useVehicleCreate() {
  const { mutate } = useSWRConfig();
  // Draft save
  const createDraft = async (data: { chassis_number: string }) => {
    try {
      const result = await createDraftFetcher({
        chassis_number: data.chassis_number,
        is_draft: true,
      });
      toast.success('Taslak başarıyla oluşturuldu');
      mutate('/api/vehicles');
      return result;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };
  // Full save/update
  const updateVehicle = async (vehicleId: number, data: VehicleCreateInput) => {
    try {
      const result = await updateVehicleFetcher(vehicleId, data);
      toast.success('Araç başarıyla kaydedildi');
      mutate('/api/vehicles');
      return result;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };
  return { createDraft, updateVehicle };
}
