"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllAgencies as useGetAllAgenciesService,
  useCreateAgency,
  useUpdateAgency,
  useDeleteAgency
} from './agency-service';
import { Agency } from './agency-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm acenteleri çeken hook
export function useAllAgencies() {
  // Hook örneği oluşturalım
  const agenciesHook = useGetAllAgenciesService();

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (agenciesHook.error) {
      toast.error("Hata", {
        description: "Acenteler yüklenirken bir hata oluştu",
      });
      console.error('Acenteler yükleme hatası:', agenciesHook.error);
    }
  }, [agenciesHook.error]);

  return agenciesHook;
}

// Acente ekle, güncelle ve sil için mutation hook'ları
export function useAgencyMutations() {
  const queryClient = useQueryClient();
  
  // Mutation hook'ları
  const createMutation = useCreateAgency();
  const updateMutation = useUpdateAgency();
  const deleteMutation = useDeleteAgency();
  
  // Ortak isPending durumu
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Acente ekleme
  const addAgency = (data: Omit<Agency, 'id' | 'created_at'>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
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
  };

  // Acente güncelleme
  const updateAgency = ({ id, data }: { id: number, data: Partial<Omit<Agency, 'id' | 'created_at'>> }) => {
    updateMutation.mutate({ id, data }, {
      onSuccess: () => {
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
  };

  // Acente silme
  const deleteAgency = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
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
  };

  return {
    addAgency,
    updateAgency,
    deleteAgency,
    isPending
  };
}
