"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VehicleStatus, createVehicleStatus, updateVehicleStatus, deleteVehicleStatus, useGetAllVehicleStatuses } from './vehicle-status-service';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm araç durumlarını çeken hook
export function useAllVehicleStatuses() {
  const vehicleStatusHook = useGetAllVehicleStatuses();
  
  const result = useQuery<VehicleStatus[]>({
    queryKey: ['vehicle-statuses'],
    queryFn: vehicleStatusHook.queryFn,
    enabled: vehicleStatusHook.enabled,
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Araç durumları yüklenirken bir hata oluştu",
      });
      console.error('Araç durumları yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

// Araç durumu ekle, güncelle ve sil için mutation hook'ları
export function useVehicleStatusMutations() {
  const queryClient = useQueryClient();
  
  // Servis hook'larının örneklerini oluştur
  const createService = createVehicleStatus();
  const updateService = updateVehicleStatus();
  const deleteService = deleteVehicleStatus();
  
  // Araç durumu ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<VehicleStatus, 'id' | 'created_at'>) => {
      return createService.mutateAsync(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-statuses'] });
      toast.success("Başarılı", {
        description: "Araç durumu başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç durumu eklenirken bir hata oluştu",
      });
      console.error('Araç durumu ekleme hatası:', error);
    }
  });

  // Araç durumu güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<VehicleStatus> }) => {
      return updateService.mutateAsync({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-statuses'] });
      toast.success("Başarılı", {
        description: "Araç durumu başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç durumu güncellenirken bir hata oluştu",
      });
      console.error('Araç durumu güncelleme hatası:', error);
    }
  });

  // Araç durumu silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteService.mutateAsync(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-statuses'] });
      toast.success("Başarılı", {
        description: "Araç durumu başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç durumu silinirken bir hata oluştu",
      });
      console.error('Araç durumu silme hatası:', error);
    }
  });

  return {
    addVehicleStatus: addMutation.mutate,
    updateVehicleStatus: updateMutation.mutate,
    deleteVehicleStatus: deleteMutation.mutate,
    isAddingVehicleStatus: addMutation.isPending,
    isUpdatingVehicleStatus: updateMutation.isPending,
    isDeletingVehicleStatus: deleteMutation.isPending,
  };
}
