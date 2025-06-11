'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllClientTypes,
  useGetClientTypeById,
  useCreateClientType,
  useUpdateClientType,
  useDeleteClientType 
} from './client-type-service';
import { ClientType, ClientTypeFormValues } from './client-type-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm müşteri tiplerini getiren hook
export function useAllClientTypes() {
  // Hook örneği oluşturalım
  const clientTypesHook = useGetAllClientTypes();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (clientTypesHook.error) {
      toast.error("Hata", {
        description: "Müşteri tipleri yüklenirken bir hata oluştu",
      });
      console.error('Müşteri tipleri yükleme hatası:', clientTypesHook.error);
    }
  }, [clientTypesHook.error]);

  return clientTypesHook;
}

// ID'ye göre tek bir müşteri tipi getiren hook
export function useClientTypeById(id: number) {
  return useGetClientTypeById(id);
}

// Müşteri tipi verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useClientTypeMutations() {
  const queryClient = useQueryClient();
  
  // Hook örneklerini oluşturalım
  const createClientTypeHook = useCreateClientType();
  const updateClientTypeHook = useUpdateClientType();
  const deleteClientTypeHook = useDeleteClientType();

  // Müşteri tipi ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<ClientType, 'id' | 'created_at'>) => {
      return createClientTypeHook.mutateAsync(data);
    },
    onSuccess: () => {
      // Invalidate client-type ile ilgili tüm sorgu önbelleğini temizle
      queryClient.invalidateQueries({ queryKey: ['client-types'] });
      toast.success("Başarılı", {
        description: "Müşteri tipi başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Müşteri tipi eklenirken bir hata oluştu",
      });
      console.error('Müşteri tipi ekleme hatası:', error);
    }
  });

  // Müşteri tipi güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<ClientType, 'id' | 'created_at'> }) => {
      return updateClientTypeHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-types'] });
      toast.success("Başarılı", {
        description: "Müşteri tipi başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Müşteri tipi güncellenirken bir hata oluştu",
      });
      console.error('Müşteri tipi güncelleme hatası:', error);
    }
  });

  // Müşteri tipi silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteClientTypeHook.mutateAsync(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-types'] });
      toast.success("Başarılı", {
        description: "Müşteri tipi başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Müşteri tipi silinirken bir hata oluştu",
      });
      console.error('Müşteri tipi silme hatası:', error);
    }
  });

  // Kullanışlı fonksiyon ve durumlar
  return {
    // Mutations
    addClientType: (data: ClientTypeFormValues) => addMutation.mutate(data),
    updateClientType: ({ id, data }: { id: number; data: ClientTypeFormValues }) => 
      updateMutation.mutate({ id, data }),
    deleteClientType: (id: number) => deleteMutation.mutate(id),
    
    // Durum bilgileri
    isAddingClientType: addMutation.isPending,
    isUpdatingClientType: updateMutation.isPending,
    isDeletingClientType: deleteMutation.isPending
  };
}
