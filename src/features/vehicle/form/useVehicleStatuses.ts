import { useEffect, useState } from 'react';
import { getVehicleStatuses, VehicleStatus } from '@/features/definitions/vehicle-statuses/vehicle-statusService';

export function useVehicleStatuses() {
  const [statuses, setStatuses] = useState<VehicleStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVehicleStatuses()
      .then(setStatuses)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { statuses, loading, error };
}
