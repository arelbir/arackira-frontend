"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch 
} from './branch-service';
import { Branch } from './branch-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm şubeleri getiren hook
export function useAllBranches() {
  // Hook örneği oluşturalım
  const branchesHook = useGetAllBranches();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (branchesHook.error) {
      toast.error("Hata", {
        description: "Tüm şubeler yüklenirken bir hata oluştu",
      });
      console.error('Tüm şubeler yükleme hatası:', branchesHook.error);
    }
  }, [branchesHook.error]);

  return branchesHook;
}

// Şube verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useBranchMutations() {
  const queryClient = useQueryClient();
  
  // Hook örnekleri oluşturalım
  const createBranchHook = useCreateBranch();
  const updateBranchHook = useUpdateBranch();
  const deleteBranchHook = useDeleteBranch();

  // Şube ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Branch, 'id' | 'created_at'>) => {
      return createBranchHook.mutateAsync(data);
    },
    onSuccess: () => {
      // Tüm şube ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
      toast.success("Başarılı", {
        description: "Şube başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Şube eklenirken bir hata oluştu",
      });
      console.error('Şube ekleme hatası:', error);
    }
  });

  // Şube güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Omit<Branch, 'id' | 'created_at'>> }) => {
      return updateBranchHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      // Tüm şube ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
      toast.success("Başarılı", {
        description: "Şube başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Şube güncellenirken bir hata oluştu",
      });
      console.error('Şube güncelleme hatası:', error);
    }
  });

  // Şube silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteBranchHook.mutateAsync(id);
    },
    onSuccess: () => {
      // Tüm şube ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
      toast.success("Başarılı", {
        description: "Şube başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Şube silinirken bir hata oluştu",
      });
      console.error('Şube silme hatası:', error);
    }
  });

  return {
    addBranch: addMutation.mutate,
    updateBranch: updateMutation.mutate,
    deleteBranch: deleteMutation.mutate,
    isAddingBranch: addMutation.isPending,
    isUpdatingBranch: updateMutation.isPending,
    isDeletingBranch: deleteMutation.isPending,
  };
}
