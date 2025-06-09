import React, { createContext, useContext, useMemo } from 'react';
import { VehicleStatus } from '@/features/definitions/vehicle-statuses/vehicle-status-service';
import { useAllVehicleStatuses } from '@/features/definitions/vehicle-statuses/use-vehicle-statuses';

interface VehicleStatusContextType {
  statuses: VehicleStatus[];
  loading: boolean;
  error: string | null;
}

const VehicleStatusContext = createContext<VehicleStatusContextType | undefined>(undefined);

export const VehicleStatusProvider = ({ children }: { children: React.ReactNode }) => {
  // React Query ile araç durumlarını getir
  const { data: statuses = [], isLoading: loading, error } = useAllVehicleStatuses();

  // Geriye uyumluluk için aynı arayüzü sağla
  const value = useMemo(() => ({ 
    statuses, 
    loading, 
    error: error ? (error as Error).message : null 
  }), [statuses, loading, error]);


  return <VehicleStatusContext.Provider value={value}>{children}</VehicleStatusContext.Provider>;
};

export function useVehicleStatuses() {
  const ctx = useContext(VehicleStatusContext);
  if (!ctx) throw new Error('useVehicleStatuses must be used within a VehicleStatusProvider');
  return ctx;
}
