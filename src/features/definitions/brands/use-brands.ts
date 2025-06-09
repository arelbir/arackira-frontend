"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllBrands as useGetAllBrandsService,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  Brand
} from './brand-service';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm markaları getiren hook
export function useAllBrands() {
  // Hook örneği oluşturalım
  const brandsHook = useGetAllBrandsService();

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (brandsHook.error) {
      toast.error("Hata", {
        description: "Markalar yüklenirken bir hata oluştu",
      });
      console.error('Markalar yükleme hatası:', brandsHook.error);
    }
  }, [brandsHook.error]);

  return brandsHook;
}

// Brand verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useBrandMutations() {
  const queryClient = useQueryClient();
  
  // Marka ekleme hook'u
  const createBrandHook = useCreateBrand();
  
  // Marka güncelleme hook'u
  const updateBrandHook = useUpdateBrand();
  
  // Marka silme hook'u
  const deleteBrandHook = useDeleteBrand();

  // Marka ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Brand, 'id' | 'created_at'>) => {
      return createBrandHook.mutateAsync(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-list'] });
      toast.success("Başarılı", {
        description: "Marka başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Marka eklenirken bir hata oluştu",
      });
      console.error('Marka ekleme hatası:', error);
    }
  });

  // Marka güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Brand, 'id' | 'created_at'>> }) => {
      return updateBrandHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-list'] });
      toast.success("Başarılı", {
        description: "Marka başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Marka güncellenirken bir hata oluştu",
      });
      console.error('Marka güncelleme hatası:', error);
    }
  });

  // Marka silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteBrandHook.mutateAsync(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-list'] });
      toast.success("Başarılı", {
        description: "Marka başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Marka silinirken bir hata oluştu",
      });
      console.error('Marka silme hatası:', error);
    }
  });

  return {
    addBrand: addMutation.mutate,
    updateBrand: updateMutation.mutate,
    deleteBrand: deleteMutation.mutate,
    isPending: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
}
