'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllCurrencies,
  useGetCurrencyById,
  useCreateCurrency,
  useUpdateCurrency,
  useDeleteCurrency 
} from './currency-service';
import { Currency, CurrencyFormValues } from './currency-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm para birimlerini getiren hook
export function useAllCurrencies() {
  // Hook örneği oluşturalım
  const currenciesHook = useGetAllCurrencies();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (currenciesHook.error) {
      toast.error("Hata", {
        description: "Para birimleri yüklenirken bir hata oluştu",
      });
      console.error('Para birimleri yükleme hatası:', currenciesHook.error);
    }
  }, [currenciesHook.error]);

  return currenciesHook;
}

// ID'ye göre tek bir para birimi getiren hook
export function useCurrencyById(id: number) {
  return useGetCurrencyById(id);
}

// Para birimi verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useCurrencyMutations() {
  const queryClient = useQueryClient();
  
  // Hook örneklerini oluşturalım
  const createCurrencyHook = useCreateCurrency();
  const updateCurrencyHook = useUpdateCurrency();
  const deleteCurrencyHook = useDeleteCurrency();

  // Para birimi ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Currency, 'id' | 'created_at'>) => {
      return createCurrencyHook.mutateAsync(data);
    },
    onSuccess: () => {
      // Invalidate currency ile ilgili tüm sorgu önbelleğini temizle
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-list'] });
      queryClient.invalidateQueries();
      toast.success("Başarılı", {
        description: "Para birimi başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Para birimi eklenirken bir hata oluştu",
      });
      console.error('Para birimi ekleme hatası:', error);
    }
  });

  // Para birimi güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Currency, 'id' | 'created_at'> }) => {
      return updateCurrencyHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-list'] });
      queryClient.invalidateQueries();
      toast.success("Başarılı", {
        description: "Para birimi başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Para birimi güncellenirken bir hata oluştu",
      });
      console.error('Para birimi güncelleme hatası:', error);
    }
  });

  // Para birimi silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteCurrencyHook.mutateAsync(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      queryClient.invalidateQueries({ queryKey: ['currencies-list'] });
      queryClient.invalidateQueries();
      toast.success("Başarılı", {
        description: "Para birimi başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Para birimi silinirken bir hata oluştu",
      });
      console.error('Para birimi silme hatası:', error);
    }
  });

  // Kullanışlı fonksiyon ve durumlar
  return {
    // Mutations
    addCurrency: (data: CurrencyFormValues) => addMutation.mutate(data),
    updateCurrency: ({ id, data }: { id: number; data: CurrencyFormValues }) => 
      updateMutation.mutate({ id, data }),
    deleteCurrency: (id: number) => deleteMutation.mutate(id),
    
    // Durum bilgileri
    isAddingCurrency: addMutation.isPending,
    isUpdatingCurrency: updateMutation.isPending,
    isDeletingCurrency: deleteMutation.isPending
  };
}
