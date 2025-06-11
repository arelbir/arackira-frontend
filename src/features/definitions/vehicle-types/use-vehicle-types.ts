"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VehicleType, vehicleTypeService } from './vehicle-type-service';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// Tüm araç tiplerini çeken hook
export function useAllVehicleTypes() {
  const { token } = useAuth();
  const service = vehicleTypeService.getAll();
  
  const result = useQuery<VehicleType[]>({
    queryKey: ['vehicle-types'],
    queryFn: service.queryFn,
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme
    enabled: !!token && service.enabled, // Sadece token varsa sorguyu çalıştır
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Araç tipleri yüklenirken bir hata oluştu",
      });
      console.error('Araç tipleri yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

// Araç tipi ekle, güncelle ve sil için mutation hook'ları
export function useVehicleTypeMutations() {
  const queryClient = useQueryClient();
  
  // Araç tipi ekleme
  const addMutation = useMutation({
    mutationFn: vehicleTypeService.create().mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      toast.success("Başarılı", {
        description: "Araç tipi başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç tipi eklenirken bir hata oluştu",
      });
      console.error('Araç tipi ekleme hatası:', error);
    }
  });

  // Araç tipi güncelleme
  const updateMutation = useMutation({
    mutationFn: vehicleTypeService.update().mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      toast.success("Başarılı", {
        description: "Araç tipi başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç tipi güncellenirken bir hata oluştu",
      });
      console.error('Araç tipi güncelleme hatası:', error);
    }
  });

  // Araç tipi silme
  const deleteMutation = useMutation({
    mutationFn: vehicleTypeService.delete().mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      toast.success("Başarılı", {
        description: "Araç tipi başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç tipi silinirken bir hata oluştu",
      });
      console.error('Araç tipi silme hatası:', error);
    }
  });

  return {
    addVehicleType: addMutation.mutate,
    updateVehicleType: updateMutation.mutate,
    deleteVehicleType: deleteMutation.mutate,
    isAddingVehicleType: addMutation.isPending,
    isUpdatingVehicleType: updateMutation.isPending,
    isDeletingVehicleType: deleteMutation.isPending,
  };
}
