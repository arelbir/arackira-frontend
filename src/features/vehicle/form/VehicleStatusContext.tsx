import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllVehicleStatuses, VehicleStatus } from '@/features/definitions/vehicle-statuses/vehicleStatusService';

interface VehicleStatusContextType {
  statuses: VehicleStatus[];
  loading: boolean;
  error: string | null;
}

const VehicleStatusContext = createContext<VehicleStatusContextType | undefined>(undefined);

export const VehicleStatusProvider = ({ children }: { children: React.ReactNode }) => {
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
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('VehicleStatusProvider state', { statuses, loading, error });
  }, [statuses, loading, error]);

  const value = useMemo(() => ({ statuses, loading, error }), [statuses, loading, error]);

  return <VehicleStatusContext.Provider value={value}>{children}</VehicleStatusContext.Provider>;
};

export function useVehicleStatuses() {
  const ctx = useContext(VehicleStatusContext);
  if (!ctx) throw new Error('useVehicleStatuses must be used within a VehicleStatusProvider');
  return ctx;
}
