"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllAgencies,
  useCreateAgency,
  useUpdateAgency,
  useDeleteAgency 
} from './agency-service';
import { Agency } from './agency-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm acenteleri getiren hook
export function useAllAgencies() {
  // Hook örneği oluşturalım
  const agenciesHook = useGetAllAgencies();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (agenciesHook.error) {
      toast.error("Hata", {
        description: "Tüm acenteler yüklenirken bir hata oluştu",
      });
      console.error('Tüm acenteler yükleme hatası:', agenciesHook.error);
    }
  }, [agenciesHook.error]);

  return agenciesHook;
}

// Acente verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useAgencyMutations() {
  const queryClient = useQueryClient();
  
  // Hook örnekleri oluşturalım
  const createAgencyHook = useCreateAgency();
  const updateAgencyHook = useUpdateAgency();
  const deleteAgencyHook = useDeleteAgency();

  // Acente ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Agency, 'id' | 'created_at'>) => {
      return createAgencyHook.mutateAsync(data);
    },
    onSuccess: () => {
      // Tüm acente ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['agencies-list'] });
      toast.success("Başarılı", {
        description: "Acente başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Acente eklenirken bir hata oluştu",
      });
      console.error('Acente ekleme hatası:', error);
    }
  });

  // Acente güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Omit<Agency, 'id' | 'created_at'>> }) => {
      return updateAgencyHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      // Tüm acente ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['agencies-list'] });
      toast.success("Başarılı", {
        description: "Acente başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Acente güncellenirken bir hata oluştu",
      });
      console.error('Acente güncelleme hatası:', error);
    }
  });

  // Acente silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteAgencyHook.mutateAsync(id);
    },
    onSuccess: () => {
      // Tüm acente ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['agencies-list'] });
      toast.success("Başarılı", {
        description: "Acente başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Acente silinirken bir hata oluştu",
      });
      console.error('Acente silme hatası:', error);
    }
  });

  return {
    addAgency: addMutation.mutate,
    updateAgency: updateMutation.mutate,
    deleteAgency: deleteMutation.mutate,
    isAddingAgency: addMutation.isPending,
    isUpdatingAgency: updateMutation.isPending,
    isDeletingAgency: deleteMutation.isPending,
  };
}
