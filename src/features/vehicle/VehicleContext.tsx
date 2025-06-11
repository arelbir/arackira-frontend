import React, { createContext, useContext } from 'react';
import { useVehicle as useVehicleHook } from './hooks/useVehicle';

// Tip güvenliği için context tipi (gerekirse VehicleContextType oluşturabilirsin)
import type { Vehicle } from './vehicleService';

export interface VehicleContextType {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (data: Omit<Vehicle, 'id'>) => Promise<void>;
  editVehicle: (id: number, data: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (id: number, isDraft: boolean) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider = ({ children }: { children: React.ReactNode }) => {
  const vehicle = useVehicleHook();
  // Memoize the value for referential stability
  const value = React.useMemo(() => vehicle, [
    vehicle.vehicles,
    vehicle.loading,
    vehicle.error,
    vehicle.fetchVehicles,
    vehicle.addVehicle,
    vehicle.editVehicle,
    vehicle.removeVehicle
  ]);
  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error('useVehicle must be used within a VehicleProvider');
  return ctx;
};
