import useSWR from 'swr';
import { getAuthenticatedApiClient } from '@/lib/auth-api-client';
import { Vehicle, VehicleSchema } from '../types';
import { toast } from 'sonner';

const ENDPOINT = '/api/vehicles';

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const api = getAuthenticatedApiClient<Vehicle[]>();
  const data = await api.get(ENDPOINT);
  // runtime validate
  const parsed = VehicleSchema.array().safeParse(data);
  if (!parsed.success) {
    throw new Error('Invalid vehicle payload');
  }
  return parsed.data;
};

export const useVehicles = () => {
  const { data, error, isLoading, mutate } = useSWR<Vehicle[]>(ENDPOINT, fetchVehicles, {
    onError: () => toast.error('Failed to fetch vehicles'),
    onSuccess: (d) => toast.success(`${d.length} vehicles loaded`, { duration: 2000 })
  });

  return {
    vehicles: data ?? [],
    loading: isLoading,
    error,
    refresh: mutate
  };
};
