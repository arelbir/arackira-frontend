import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { useVehicleById } from "../use-vehicles";
import { Vehicle } from "../vehicle-service";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleContextProps {
  // Tab yönetimi
  activeTabId: string;
  setActiveTabId: (tabId: string) => void;
  
  // Araç verileri
  vehicleData: Partial<Vehicle>;
  updateVehicleData: (data: Partial<Vehicle>) => void;
  
  // Form durumu
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  
  // Diğer özellikler
  isEditMode: boolean;
  vehicleId: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const defaultContext: VehicleContextProps = {
  activeTabId: "temel-kayit",
  setActiveTabId: () => {},
  vehicleData: {},
  updateVehicleData: () => {},
  isDirty: false,
  setIsDirty: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  isEditMode: false,
  vehicleId: null,
  isLoading: false,
  error: null,
  refetch: () => {}
};

const VehicleContext = createContext<VehicleContextProps>(defaultContext);

export const VehicleProvider: React.FC<{ children: React.ReactNode; vehicleId?: number }> = ({ 
  children, 
  vehicleId = null 
}) => {
  const queryClient = useQueryClient();
  const [activeTabId, setActiveTabId] = useState<string>("temel-kayit");
  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // React Query ile araç verilerini getir
  const { 
    data: vehicleDetails, 
    isLoading, 
    error, 
    refetch 
  } = useVehicleById(vehicleId);
  
  // Araç verileri yüklendikçe form verilerini güncelle
  useEffect(() => {
    if (vehicleDetails && !isDirty) {
      setVehicleData(vehicleDetails);
    }
  }, [vehicleDetails, isDirty]);
  
  const updateVehicleData = useCallback((data: Partial<Vehicle>) => {
    setVehicleData((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);
  
  const contextValue: VehicleContextProps = {
    activeTabId,
    setActiveTabId,
    vehicleData,
    updateVehicleData,
    isDirty,
    setIsDirty,
    isSubmitting,
    setIsSubmitting,
    isEditMode: !!vehicleId,
    vehicleId,
    isLoading,
    error: error as Error | null,
    refetch
  };
  
  return (
    <VehicleContext.Provider value={contextValue}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => {
  const context = useContext(VehicleContext);
  
  if (!context) {
    throw new Error("useVehicleContext must be used within a VehicleProvider");
  }
  
  return context;
};

// Hem context hem de react query verilerine erişim sağlayan yardımcı hook
export const useVehicleForm = () => {
  const context = useVehicleContext();
  const queryClient = useQueryClient();
  
  // Form gönderildiğinde önbelleği temizle
  const invalidateVehicleQueries = useCallback(() => {
    if (context.vehicleId) {
      queryClient.invalidateQueries({ queryKey: ['vehicle', context.vehicleId] });
    }
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  }, [queryClient, context.vehicleId]);
  
  return {
    ...context,
    invalidateVehicleQueries
  };
};

export default VehicleContext;
