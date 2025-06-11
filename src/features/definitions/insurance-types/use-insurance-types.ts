'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllInsuranceTypes,
  useGetInsuranceTypeById,
  useCreateInsuranceType,
  useUpdateInsuranceType,
  useDeleteInsuranceType 
} from './insurance-type-service';
import { InsuranceType, InsuranceTypeFormValues } from './insurance-type-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm sigorta tiplerini getiren hook
export function useAllInsuranceTypes() {
  // Hook örneği oluşturalım
  const insuranceTypesHook = useGetAllInsuranceTypes();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (insuranceTypesHook.error) {
      toast.error("Hata", {
        description: "Sigorta tipleri yüklenirken bir hata oluştu",
      });
      console.error('Sigorta tipleri yükleme hatası:', insuranceTypesHook.error);
    }
  }, [insuranceTypesHook.error]);

  return insuranceTypesHook;
}

// ID'ye göre tek bir sigorta tipi getiren hook
export function useInsuranceTypeById(id: number) {
  return useGetInsuranceTypeById(id);
}

// Sigorta tipi verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useInsuranceTypeMutations() {
  const queryClient = useQueryClient();
  
  // Hook örneklerini oluşturalım
  const createInsuranceTypeHook = useCreateInsuranceType();
  const updateInsuranceTypeHook = useUpdateInsuranceType();
  const deleteInsuranceTypeHook = useDeleteInsuranceType();

  // Sigorta tipi ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<InsuranceType, 'id' | 'created_at'>) => {
      return createInsuranceTypeHook.mutateAsync(data);
    },
    onSuccess: (newInsuranceType) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['insurance-types-list']
      });
      // Tekli sorgu için önbelleği düzenle (tekil sorguyu da temizler)
      queryClient.setQueryData([`insurance-types-item-${newInsuranceType.id}`], newInsuranceType);
      toast.success("Başarılı", {
        description: `${newInsuranceType.name} sigorta tipi eklendi`
      });
    },
    onError: (error: Error) => {
      toast.error("Hata", {
        description: "Sigorta tipi eklenirken bir hata oluştu"
      });
      console.error('Sigorta tipi ekleme hatası:', error);
    }
  });

  // Sigorta tipi güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Omit<InsuranceType, 'id' | 'created_at'> }) => {
      return updateInsuranceTypeHook.mutateAsync({ id, data });
    },
    onSuccess: (updatedInsuranceType) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['insurance-types-list']
      });
      // Tekli sorgu için önbelleği düzenle
      queryClient.setQueryData([`insurance-types-item-${updatedInsuranceType.id}`], updatedInsuranceType);
      toast.success("Başarılı", {
        description: `${updatedInsuranceType.name} sigorta tipi güncellendi`
      });
    },
    onError: (error: Error) => {
      toast.error("Hata", {
        description: "Sigorta tipi güncellenirken bir hata oluştu"
      });
      console.error('Sigorta tipi güncelleme hatası:', error);
    }
  });

  // Sigorta tipi silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteInsuranceTypeHook.mutateAsync(id);
    },
    onSuccess: (_, deletedId) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['insurance-types-list']
      });
      // Silinen öğeyi önbellekten kaldır
      queryClient.removeQueries({ queryKey: [`insurance-types-item-${deletedId}`] });
      toast.success("Başarılı", {
        description: "Sigorta tipi silindi"
      });
    },
    onError: (error: Error) => {
      toast.error("Hata", {
        description: "Sigorta tipi silinirken bir hata oluştu"
      });
      console.error('Sigorta tipi silme hatası:', error);
    }
  });

  return {
    addInsuranceType: addMutation.mutate,
    updateInsuranceType: updateMutation.mutate,
    deleteInsuranceType: deleteMutation.mutate,
    isAddingInsuranceType: addMutation.isPending,
    isUpdatingInsuranceType: updateMutation.isPending,
    isDeletingInsuranceType: deleteMutation.isPending,
    error: addMutation.error || updateMutation.error || deleteMutation.error
  };
}
