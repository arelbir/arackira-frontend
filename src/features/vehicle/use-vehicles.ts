"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Vehicle, 
  getAllVehicles,
  getVehicleById,
  getDraftVehicles, 
  getDraftVehicleById,
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  deleteDraftVehicle
} from './vehicle-service';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm araçları getiren hook
export function useAllVehicles() {
  const result = useQuery<Vehicle[]>({ 
    queryKey: ['vehicles'],
    queryFn: () => getAllVehicles(),
    staleTime: 1000 * 60 * 2, // 2 dakika önbellekleme (araç listeleri daha sık değişebilir)
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Araçlar yüklenirken bir hata oluştu",
      });
      console.error('Araçlar yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

// Tek bir aracı ID ile getiren hook
export function useVehicleById(id: number | null | undefined) {
  const result = useQuery<Vehicle>({ 
    queryKey: ['vehicle', id],
    queryFn: () => {
      if (!id) throw new Error('Araç ID değeri verilmedi');
      return getVehicleById(id);
    },
    enabled: !!id, // ID varsa sorguyu çalıştır
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme 
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Araç bilgileri yüklenirken bir hata oluştu",
      });
      console.error('Araç detayı yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

// Taslak araçları getiren hook
export function useDraftVehicles() {
  const result = useQuery<Vehicle[]>({ 
    queryKey: ['vehicles', 'drafts'],
    queryFn: () => getDraftVehicles(),
    staleTime: 1000 * 60 * 2, // 2 dakika önbellekleme
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Taslak araçlar yüklenirken bir hata oluştu",
      });
      console.error('Taslak araçlar yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

// Tek bir taslak aracı ID ile getiren hook
export function useDraftVehicleById(id: number | null | undefined) {
  const result = useQuery<Vehicle>({ 
    queryKey: ['vehicles', 'drafts', id],
    queryFn: () => {
      if (!id) throw new Error('Taslak araç ID değeri verilmedi');
      return getDraftVehicleById(id);
    },
    enabled: !!id, // ID varsa sorguyu çalıştır
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Taslak araç bilgileri yüklenirken bir hata oluştu",
      });
      console.error('Taslak araç detayı yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}

// Araç CRUD işlemleri için mutation hook'ları
export function useVehicleMutations() {
  const queryClient = useQueryClient();
  
  // Araç ekleme - Optimistik güncelleme ile
  const addMutation = useMutation({
    mutationFn: (data: Partial<Vehicle>) => createVehicle(data),
    onMutate: async (newVehicleData) => {
      // Önceki sorguları iptal et
      const isDraft = newVehicleData.is_draft ?? false;
      const queryKey = isDraft ? ['vehicles', 'drafts'] : ['vehicles'];
      await queryClient.cancelQueries({ queryKey });
      
      // Mevcut verileri al
      const previousVehicles = queryClient.getQueryData<Vehicle[]>(queryKey) || [];
      
      // Optimistik güncelleme yap - Geçici ID ile
      const tempId = Date.now(); // Geçici ID olarak timestamp kullan
      const newVehicle = {
        ...newVehicleData,
        id: tempId, // Sunucu dönüşünde gerçek ID ile değiştirilecek
        created_at: new Date().toISOString(),
      } as Vehicle;
      
      queryClient.setQueryData<Vehicle[]>(queryKey, [...previousVehicles, newVehicle]);
      
      return { previousVehicles, tempId, queryKey };
    },
    onSuccess: (data, _variables, context) => {
      // Geçici ID ile eklenen aracı gerçek ID'li araç ile değiştir
      if (context?.queryKey && context?.tempId) {
        const currentVehicles = queryClient.getQueryData<Vehicle[]>(context.queryKey) || [];
        const updatedVehicles = currentVehicles.map(vehicle => 
          vehicle.id === context.tempId ? data : vehicle
        );
        queryClient.setQueryData<Vehicle[]>(context.queryKey, updatedVehicles);
      }
      
      toast.success("Başarılı", {
        description: `Araç başarıyla ${data.is_draft ? 'taslak olarak' : ''} eklendi`,
      });
    },
    onError: (error, _variables, context) => {
      // Hata durumunda önceki verileri geri getir
      if (context?.queryKey && context?.previousVehicles) {
        queryClient.setQueryData(context.queryKey, context.previousVehicles);
      }
      
      toast.error("Hata", {
        description: "Araç eklenirken bir hata oluştu",
      });
      console.error('Araç ekleme hatası:', error);
    },
    onSettled: (_data, _error, variables) => {
      // İşlem tamamlandığında sorguları yenile
      const queryKey = variables.is_draft ? ['vehicles', 'drafts'] : ['vehicles'];
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Araç güncelleme - Optimistik güncelleme ile
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Vehicle> }) => {
      return updateVehicle(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Önceki sorguları iptal et
      await queryClient.cancelQueries({ queryKey: ['vehicle', id] });
      const isDraft = data.is_draft ?? false;
      if (isDraft) {
        await queryClient.cancelQueries({ queryKey: ['vehicles', 'drafts'] });
      } else {
        await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      }
      
      // Mevcut verileri al
      const previousVehicle = queryClient.getQueryData<Vehicle>(['vehicle', id]);
      const previousVehicles = isDraft 
        ? queryClient.getQueryData<Vehicle[]>(['vehicles', 'drafts']) 
        : queryClient.getQueryData<Vehicle[]>(['vehicles']);
      
      // Optimistik güncelleme yap - Tek araç detayı
      if (previousVehicle) {
        queryClient.setQueryData<Vehicle>(
          ['vehicle', id], 
          {...previousVehicle, ...data}
        );
      }
      
      // Optimistik güncelleme yap - Araç listesi
      if (previousVehicles) {
        const updatedVehicles = previousVehicles.map(vehicle => 
          vehicle.id === id ? {...vehicle, ...data} : vehicle
        );
        
        if (isDraft) {
          queryClient.setQueryData<Vehicle[]>(['vehicles', 'drafts'], updatedVehicles);
        } else {
          queryClient.setQueryData<Vehicle[]>(['vehicles'], updatedVehicles);
        }
      }
      
      // Önceki verileri döndür
      return { previousVehicle, previousVehicles, isDraft };
    },
    onSuccess: (data) => {
      toast.success("Başarılı", {
        description: "Araç bilgileri başarıyla güncellendi",
      });
    },
    onError: (error, { id }, context: any) => {
      // Hata durumunda önceki verileri geri getir
      if (context?.previousVehicle) {
        queryClient.setQueryData(['vehicle', id], context.previousVehicle);
      }
      
      if (context?.previousVehicles) {
        const queryKey = context.isDraft ? ['vehicles', 'drafts'] : ['vehicles'];
        queryClient.setQueryData(queryKey, context.previousVehicles);
      }
      
      toast.error("Hata", {
        description: "Araç bilgileri güncellenirken bir hata oluştu",
      });
      console.error('Araç güncelleme hatası:', error);
    },
    onSettled: (data) => {
      // İşlem tamamlandığında sorguları yenile
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['vehicle', data.id] });
      }
      
      if (data?.is_draft) {
        queryClient.invalidateQueries({ queryKey: ['vehicles', 'drafts'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      }
    }
  });

  // Araç silme - Optimistik güncelleme ile
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVehicle(id),
    onMutate: async (deletedId) => {
      // Önceki sorguyu iptal et
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      
      // Mevcut verileri al
      const previousVehicles = queryClient.getQueryData<Vehicle[]>(['vehicles']);
      
      // Optimistik güncelleme yap
      if (previousVehicles) {
        queryClient.setQueryData<Vehicle[]>(['vehicles'], 
          previousVehicles.filter(vehicle => vehicle.id !== deletedId)
        );
      }
      
      // Detay sayfasını temizle
      queryClient.removeQueries({ queryKey: ['vehicle', deletedId] });
      
      // Önceki verileri döndür
      return { previousVehicles };
    },
    onSuccess: (_data, _variables) => {
      toast.success("Başarılı", {
        description: "Araç başarıyla silindi",
      });
    },
    onError: (error, deletedId, context: any) => {
      // Hata durumunda önceki verileri geri getir
      if (context?.previousVehicles) {
        queryClient.setQueryData(['vehicles'], context.previousVehicles);
      }
      toast.error("Hata", {
        description: "Araç silinirken bir hata oluştu",
      });
      console.error('Araç silme hatası:', error);
    },
    onSettled: () => {
      // İşlem tamamlandığında sorguları yenile
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });

  // Taslak araç silme
  const deleteDraftMutation = useMutation({
    mutationFn: (id: number) => deleteDraftVehicle(id),
    onSuccess: (_data, variables) => {
      // Taslak araç listesini güncelle
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'drafts'] });
      // İlgili detay sayfası sorgusunu temizle
      queryClient.removeQueries({ queryKey: ['vehicles', 'drafts', variables] });
      
      toast.success("Başarılı", {
        description: "Taslak araç başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Taslak araç silinirken bir hata oluştu",
      });
      console.error('Taslak araç silme hatası:', error);
    }
  });

  return {
    // Create
    addVehicle: addMutation.mutate,
    isAddingVehicle: addMutation.isPending,
    
    // Update
    updateVehicle: updateMutation.mutate,
    isUpdatingVehicle: updateMutation.isPending,
    
    // Delete
    deleteVehicle: deleteMutation.mutate,
    isDeletingVehicle: deleteMutation.isPending,
    
    // Draft Delete
    deleteDraftVehicle: deleteDraftMutation.mutate,
    isDeletingDraftVehicle: deleteDraftMutation.isPending,
  };
}
