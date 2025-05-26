import React, { useEffect, useState } from 'react';
import { getAllVehicleStatuses, VehicleStatus } from '@/features/definitions/vehicle-statuses/vehicleStatusService';

export function useVehicleStatuses() {
  const [statuses, setStatuses] = useState<VehicleStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (!token) {
      setError('Oturum bulunamadı');
      setLoading(false);
      return;
    }
    getAllVehicleStatuses(token)
      .then(setStatuses)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    console.log('useVehicleStatuses state', { statuses, loading, error });
  }, [statuses, loading, error]);

  return { statuses, loading, error };
}
