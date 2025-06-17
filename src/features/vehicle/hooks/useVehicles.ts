import useSWR from 'swr';
import { StrictVehicle } from './useVehicleTable';
import { apiFetcher } from '@/lib/api';

export function useVehicles() {
  const { data, error, isLoading } = useSWR<StrictVehicle[]>('/api/vehicles', apiFetcher);

  return {
    vehicles: data ?? [],
    loading: isLoading,
    error
  };
}
