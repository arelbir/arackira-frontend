'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllFuelTypes,
  useGetFuelTypeById,
  useCreateFuelType,
  useUpdateFuelType,
  useDeleteFuelType 
} from './fuel-type-service';
import { FuelType, FuelTypeFormValues } from './fuel-type-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm yakıt tiplerini getiren hook
export function useAllFuelTypes() {
  // Hook örneği oluşturalım
  const fuelTypesHook = useGetAllFuelTypes();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (fuelTypesHook.error) {
      toast.error("Hata", {
        description: "Yakıt tipleri yüklenirken bir hata oluştu",
      });
      console.error('Yakıt tipleri yükleme hatası:', fuelTypesHook.error);
    }
  }, [fuelTypesHook.error]);

  return fuelTypesHook;
}

// ID'ye göre tek bir yakıt tipi getiren hook
export function useFuelTypeById(id: number) {
  return useGetFuelTypeById(id);
}

// Yakıt tipi verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useFuelTypeMutations() {
  const queryClient = useQueryClient();
  
  // Hook örneklerini oluşturalım
  const createFuelTypeHook = useCreateFuelType();
  const updateFuelTypeHook = useUpdateFuelType();
  const deleteFuelTypeHook = useDeleteFuelType();

  // Yakıt tipi ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<FuelType, 'id' | 'created_at'>) => {
      return createFuelTypeHook.mutateAsync(data);
    },
    onSuccess: () => {
      // Invalidate fuel-types ile ilgili tüm sorgu önbelleğini temizle
      queryClient.invalidateQueries({ queryKey: ['fuel-types'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-types-list'] });
      queryClient.invalidateQueries();
      toast.success("Başarılı", {
        description: "Yakıt tipi başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Yakıt tipi eklenirken bir hata oluştu",
      });
      console.error('Yakıt tipi ekleme hatası:', error);
    }
  });

  // Yakıt tipi güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<FuelType, 'id' | 'created_at'> }) => {
      return updateFuelTypeHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-types'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-types-list'] });
      queryClient.invalidateQueries();
      toast.success("Başarılı", {
        description: "Yakıt tipi başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Yakıt tipi güncellenirken bir hata oluştu",
      });
      console.error('Yakıt tipi güncelleme hatası:', error);
    }
  });

  // Yakıt tipi silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteFuelTypeHook.mutateAsync(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-types'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-types-list'] });
      queryClient.invalidateQueries();
      toast.success("Başarılı", {
        description: "Yakıt tipi başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Yakıt tipi silinirken bir hata oluştu",
      });
      console.error('Yakıt tipi silme hatası:', error);
    }
  });

  // Kullanışlı fonksiyon ve durumlar
  return {
    // Mutations
    addFuelType: (data: FuelTypeFormValues) => addMutation.mutate(data),
    updateFuelType: ({ id, data }: { id: number; data: FuelTypeFormValues }) => 
      updateMutation.mutate({ id, data }),
    deleteFuelType: (id: number) => deleteMutation.mutate(id),
    
    // Durum bilgileri
    isAddingFuelType: addMutation.isPending,
    isUpdatingFuelType: updateMutation.isPending,
    isDeletingFuelType: deleteMutation.isPending
  };
}
