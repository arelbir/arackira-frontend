"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
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
} from '../vehicleService';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm araçları getiren hook
export function useAllVehiclesQuery() {
  const { token } = useAuth();
  const result = useQuery<Vehicle[]>({ 
    queryKey: ['vehicles'],
    queryFn: () => getAllVehicles(token || undefined),
    staleTime: 1000 * 60 * 2, // 2 dakika önbellekleme,
    enabled: !!token, // Sadece token varsa sorguyu çalıştır
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
export function useVehicleByIdQuery(id: number | null | undefined) {
  const { token } = useAuth();
  const result = useQuery<Vehicle>({ 
    queryKey: ['vehicle', id],
    queryFn: () => {
      if (!id) throw new Error('Araç ID değeri verilmedi');
      return getVehicleById(id, token || undefined);
    },
    enabled: !!id && !!token, // ID ve token varsa sorguyu çalıştır
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
export function useDraftVehiclesQuery() {
  const { token } = useAuth();
  const result = useQuery<Vehicle[]>({ 
    queryKey: ['vehicles', 'drafts'],
    queryFn: () => getDraftVehicles(token || undefined),
    staleTime: 1000 * 60 * 2, // 2 dakika önbellekleme,
    enabled: !!token, // Sadece token varsa sorguyu çalıştır
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

// Araç CRUD işlemleri için mutation hook'ları
export function useVehicleMutations() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const safeToken = token || undefined; // string | null -> string | undefined
  
  // Araç ekleme
  const addMutation = useMutation({
    mutationFn: (data: Partial<Vehicle>) => createVehicle(data, safeToken),
    onSuccess: (data) => {
      // Hem normal araçlar hem de taslak araçlar sorgularını güncelle
      if (data.is_draft) {
        queryClient.invalidateQueries({ queryKey: ['vehicles', 'drafts'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      }
      
      toast.success("Başarılı", {
        description: `Araç başarıyla ${data.is_draft ? 'taslak olarak' : ''} eklendi`,
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç eklenirken bir hata oluştu",
      });
      console.error('Araç ekleme hatası:', error);
    }
  });

  // Araç güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Vehicle> }) => {
      return updateVehicle(id, data, safeToken);
    },
    onSuccess: (data) => {
      // İlgili araç verilerinin sorgularını güncelle
      queryClient.invalidateQueries({ queryKey: ['vehicle', data.id] });
      
      if (data.is_draft) {
        queryClient.invalidateQueries({ queryKey: ['vehicles', 'drafts'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      }
      
      toast.success("Başarılı", {
        description: "Araç bilgileri başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç bilgileri güncellenirken bir hata oluştu",
      });
      console.error('Araç güncelleme hatası:', error);
    }
  });

  // Araç silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVehicle(id, safeToken),
    onSuccess: (_data, variables) => {
      // Ana araç listesini güncelle
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      // İlgili detay sayfası sorgusunu temizle
      queryClient.removeQueries({ queryKey: ['vehicle', variables] });
      
      toast.success("Başarılı", {
        description: "Araç başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Araç silinirken bir hata oluştu",
      });
      console.error('Araç silme hatası:', error);
    }
  });

  // Taslak araç silme
  const deleteDraftMutation = useMutation({
    mutationFn: (id: number) => deleteDraftVehicle(id, safeToken),
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
