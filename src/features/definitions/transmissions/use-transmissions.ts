"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transmission, getAllTransmissions, createTransmission, updateTransmission, deleteTransmission, useGetAllTransmissions } from './transmission-service';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// Tüm vites tiplerini çeken hook
export function useAllTransmissions() {
  // Token kontrolü için useAuth hook'unu kullan
  const { token } = useAuth();
  // Token varsa kimlik doğrulanmış kabul et
  const isAuthenticated = !!token;
  
  // Servis fonksiyonundan queryFn ve token varsa etkinleştirilecek enabled değerini al
  const { queryFn, enabled } = useGetAllTransmissions();

  // Query'yi useAuth'tan gelen kimlik doğrulama durumuna göre etkinleştir
  const result = useQuery<Transmission[]>({
    queryKey: ['transmissions'],
    queryFn,
    enabled: enabled && isAuthenticated, // Sadece token varsa ve kullanıcı giriş yapmışsa çalıştır
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Vites tipleri yüklenirken bir hata oluştu",
      });
      console.error('Vites tipleri yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

// Vites tipi ekle, güncelle ve sil için mutation hook'ları
export function useTransmissionMutations() {
  const queryClient = useQueryClient();
  
  // Servis hook'larının örneklerini oluştur
  const createService = createTransmission();
  const updateService = updateTransmission();
  const deleteService = deleteTransmission();
  
  // Vites tipi ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Transmission, 'id' | 'created_at'>) => {
      return createService.mutateAsync(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transmissions'] });
      toast.success("Başarılı", {
        description: "Vites tipi başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Vites tipi eklenirken bir hata oluştu",
      });
      console.error('Vites tipi ekleme hatası:', error);
    }
  });

  // Vites tipi güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Transmission> }) => {
      return updateService.mutateAsync(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transmissions'] });
      toast.success("Başarılı", {
        description: "Vites tipi başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Vites tipi güncellenirken bir hata oluştu",
      });
      console.error('Vites tipi güncelleme hatası:', error);
    }
  });

  // Vites tipi silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteService.mutateAsync(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transmissions'] });
      toast.success("Başarılı", {
        description: "Vites tipi başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Vites tipi silinirken bir hata oluştu",
      });
      console.error('Vites tipi silme hatası:', error);
    }
  });

  return {
    addTransmission: addMutation.mutate,
    updateTransmission: updateMutation.mutate,
    deleteTransmission: deleteMutation.mutate,
    isAddingTransmission: addMutation.isPending,
    isUpdatingTransmission: updateMutation.isPending,
    isDeletingTransmission: deleteMutation.isPending,
  };
}
