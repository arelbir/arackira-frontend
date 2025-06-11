"use client"

import { useCallback, useState } from 'react';
import { Vehicle } from '../vehicleService'; 
import { 
  useAllVehiclesQuery, 
  useVehicleMutations
} from './use-vehicles-query';

/**
 * React Query ile güçlendirilmiş useVehicle hook'u
 * Geriye uyumlu API sağlar, böylece mevcut bileşenler etkilenmez
 */
export function useVehicle() {
  // React Query hook'larını kullan
  const { 
    data: queryVehicles, 
    isLoading: queryLoading, 
    error: queryError, 
    refetch 
  } = useAllVehiclesQuery();
  
  const {
    addVehicle: mutateAddVehicle,
    updateVehicle: mutateUpdateVehicle,
    deleteVehicle: mutateDeleteVehicle,
    deleteDraftVehicle: mutateDeleteDraftVehicle,
    isAddingVehicle,
    isUpdatingVehicle,
    isDeletingVehicle,
    isDeletingDraftVehicle
  } = useVehicleMutations();

  // Manuel error state'i (React Query error'unu izlemek için)
  const [error, setError] = useState<string | null>(null);
  
  // React Query hata durumlarını manuel state'e senkronize et
  if (queryError && !error) {
    setError((queryError as Error).message || 'Bir hata oluştu');
  }

  // fetchVehicles - geriye uyumlu API 
  const fetchVehicles = useCallback(async () => {
    try {
      await refetch();
      setError(null);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [refetch]);

  // addVehicle - geriye uyumlu API
  const addVehicle = useCallback(async (data: Omit<Vehicle, 'id'>) => {
    try {
      setError(null);
      mutateAddVehicle(data as Partial<Vehicle>);
      return true; 
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [mutateAddVehicle]);

  // editVehicle - geriye uyumlu API
  const editVehicle = useCallback(async (id: number, data: Partial<Vehicle>) => {
    try {
      setError(null);
      mutateUpdateVehicle({ id, data });
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [mutateUpdateVehicle]);

  // removeVehicle - geriye uyumlu API
  const removeVehicle = useCallback(async (id: number, isDraft: boolean) => {
    try {
      setError(null);
      if (isDraft) {
        mutateDeleteDraftVehicle(id);
      } else {
        mutateDeleteVehicle(id);
      }
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  }, [mutateDeleteDraftVehicle, mutateDeleteVehicle]);

  // Mevcut arayüzü koruyarak React Query avantajlarını kullanıyoruz
  return {
    vehicles: queryVehicles || [],
    loading: queryLoading || isAddingVehicle || isUpdatingVehicle || isDeletingVehicle || isDeletingDraftVehicle,
    error, 
    fetchVehicles,
    addVehicle,
    editVehicle,
    removeVehicle,
  };
}
