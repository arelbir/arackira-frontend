"use client";

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect } from 'react';
import {
  Color,
  useGetAllColors,
  useCreateColor,
  useUpdateColor,
  useDeleteColor
} from './color-service';

/**
 * Tüm renkleri getiren hook
 * 
 * React Query hook'unu saran ve hata durumunun UI ile etkileşimini yöneten wrapper
 */
export function useAllColors() {
  const result = useGetAllColors();

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Renkler yüklenirken bir hata oluştu",
      });
      console.error('Renkler yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

/**
 * Renk verilerini eklemek, güncellemek ve silmek için mutation hook'ları
 * 
 * Tek bir isPending state ile yükleme durumlarını birleştirir
 */
export function useColorMutations() {
  const queryClient = useQueryClient();
  
  // React Query mutations
  const createMutation = useCreateColor();
  const updateMutation = useUpdateColor();
  const deleteMutation = useDeleteColor();
  
  // Toplam yükleme durumu - herhangi bir mutation işlemde mi?
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  
  // Renk ekleme işlemi
  const addColor = (data: Omit<Color, 'id' | 'created_at'>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['colors-list'] });
        toast.success("Başarılı", {
          description: "Renk başarıyla eklendi",
        });
      },
      onError: (error) => {
        toast.error("Hata", {
          description: "Renk eklenirken bir hata oluştu",
        });
        console.error('Renk ekleme hatası:', error);
      }
    });
  };

  // Renk güncelleme işlemi
  const updateColor = ({ id, data }: { id: number, data: Partial<Omit<Color, 'id' | 'created_at'>> }) => {
    updateMutation.mutate({ id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['colors-list'] });
        toast.success("Başarılı", {
          description: "Renk başarıyla güncellendi",
        });
      },
      onError: (error) => {
        toast.error("Hata", {
          description: "Renk güncellenirken bir hata oluştu",
        });
        console.error('Renk güncelleme hatası:', error);
      }
    });
  };

  // Renk silme işlemi
  const deleteColor = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['colors-list'] });
        toast.success("Başarılı", {
          description: "Renk başarıyla silindi",
        });
      },
      onError: (error) => {
        toast.error("Hata", {
          description: "Renk silinirken bir hata oluştu",
        });
        console.error('Renk silme hatası:', error);
      }
    });
  };

  return {
    addColor,
    updateColor,
    deleteColor,
    isPending
  };
}
