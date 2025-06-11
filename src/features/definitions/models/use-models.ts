"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useModelsByBrand as useModelsByBrandService,
  useGetAllModels,
  useCreateModel,
  useUpdateModel,
  useDeleteModel 
} from './model-service';
import { Model } from './model-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useModelsByBrand(brandId: number | null) {
  // Hook örneği oluşturalım
  const modelsByBrandHook = useModelsByBrandService(brandId);

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (modelsByBrandHook.error) {
      toast.error("Hata", {
        description: "Model listesi yüklenirken bir hata oluştu",
      });
      console.error('Model listesi yükleme hatası:', modelsByBrandHook.error);
    }
  }, [modelsByBrandHook.error]);

  return modelsByBrandHook;
}

// Tüm modelleri getiren hook
export function useAllModels() {
  // Hook örneği oluşturalım
  const modelsHook = useGetAllModels();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (modelsHook.error) {
      toast.error("Hata", {
        description: "Tüm modeller yüklenirken bir hata oluştu",
      });
      console.error('Tüm modeller yükleme hatası:', modelsHook.error);
    }
  }, [modelsHook.error]);

  return modelsHook;
}

// Model verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useModelMutations() {
  const queryClient = useQueryClient();
  
  // Hook örnekleri oluşturalım
  const createModelHook = useCreateModel();
  const updateModelHook = useUpdateModel();
  const deleteModelHook = useDeleteModel();

  // Model ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Model, 'id' | 'created_at'>) => {
      return createModelHook.mutateAsync(data);
    },
    onSuccess: () => {
      // Invalidate all model-related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['models-list'] });
      queryClient.invalidateQueries({ queryKey: ['models-by-brand'] });
      toast.success("Başarılı", {
        description: "Model başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Model eklenirken bir hata oluştu",
      });
      console.error('Model ekleme hatası:', error);
    }
  });

  // Model güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Omit<Model, 'id' | 'created_at'>> }) => {
      return updateModelHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      // Invalidate all model-related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['models-list'] });
      queryClient.invalidateQueries({ queryKey: ['models-by-brand'] });
      toast.success("Başarılı", {
        description: "Model başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Model güncellenirken bir hata oluştu",
      });
      console.error('Model güncelleme hatası:', error);
    }
  });

  // Model silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteModelHook.mutateAsync(id);
    },
    onSuccess: () => {
      // Invalidate all model-related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['models-list'] });
      queryClient.invalidateQueries({ queryKey: ['models-by-brand'] });
      toast.success("Başarılı", {
        description: "Model başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Model silinirken bir hata oluştu",
      });
      console.error('Model silme hatası:', error);
    }
  });

  return {
    addModel: addMutation.mutate,
    updateModel: updateMutation.mutate,
    deleteModel: deleteMutation.mutate,
    isAddingModel: addMutation.isPending,
    isUpdatingModel: updateMutation.isPending,
    isDeletingModel: deleteMutation.isPending,
  };
}
