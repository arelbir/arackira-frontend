"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllFuelTypes as useGetAllFuelTypesService,
  useCreateFuelType,
  useUpdateFuelType,
  useDeleteFuelType,
  FuelType
} from './fuel-type-service';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm yakıt tiplerini çeken hook
export function useAllFuelTypes() {
  // Hook örneği oluşturalım
  const fuelTypesHook = useGetAllFuelTypesService();

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

// Yakıt tipi ekle, güncelle ve sil için mutation hook'ları
export function useFuelTypeMutations() {
  const queryClient = useQueryClient();
  
  // Mutation hook'ları
  const createMutation = useCreateFuelType();
  const updateMutation = useUpdateFuelType();
  const deleteMutation = useDeleteFuelType();
  
  // Ortak isPending durumu
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Yakıt tipi ekleme
  const addFuelType = (data: Omit<FuelType, 'id' | 'created_at'>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fuel-types-list'] });
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
  };

  // Yakıt tipi güncelleme
  const updateFuelType = ({ id, data }: { id: number, data: Partial<Omit<FuelType, 'id' | 'created_at'>> }) => {
    updateMutation.mutate({ id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fuel-types-list'] });
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
  };

  // Yakıt tipi silme
  const deleteFuelType = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fuel-types-list'] });
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
  };

  return {
    addFuelType,
    updateFuelType,
    deleteFuelType,
    isPending
  };
}
