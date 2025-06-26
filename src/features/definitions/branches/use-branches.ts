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

// Tüm Ruhsat Sahibi Firmaleri getiren hook
export function useAllBranches() {
  // Hook örneği oluşturalım
  const branchesHook = useGetAllBranches();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (branchesHook.error) {
      toast.error("Hata", {
        description: "Tüm Ruhsat Sahibi Firmaler yüklenirken bir hata oluştu",
      });
      console.error('Tüm Ruhsat Sahibi Firmaler yükleme hatası:', branchesHook.error);
    }
  }, [branchesHook.error]);

  return branchesHook;
}

// Ruhsat Sahibi Firma verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useBranchMutations() {
  const queryClient = useQueryClient();
  
  // Hook örnekleri oluşturalım
  const createBranchHook = useCreateBranch();
  const updateBranchHook = useUpdateBranch();
  const deleteBranchHook = useDeleteBranch();

  // Ruhsat Sahibi Firma ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Branch, 'id' | 'created_at'>) => {
      return createBranchHook.mutateAsync(data);
    },
    onSuccess: () => {
      // Tüm Ruhsat Sahibi Firma ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
      toast.success("Başarılı", {
        description: "Ruhsat Sahibi Firma başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Ruhsat Sahibi Firma eklenirken bir hata oluştu",
      });
      console.error('Ruhsat Sahibi Firma ekleme hatası:', error);
    }
  });

  // Ruhsat Sahibi Firma güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Omit<Branch, 'id' | 'created_at'>> }) => {
      return updateBranchHook.mutateAsync({ id, data });
    },
    onSuccess: () => {
      // Tüm Ruhsat Sahibi Firma ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
      toast.success("Başarılı", {
        description: "Ruhsat Sahibi Firma başarıyla güncellendi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Ruhsat Sahibi Firma güncellenirken bir hata oluştu",
      });
      console.error('Ruhsat Sahibi Firma güncelleme hatası:', error);
    }
  });

  // Ruhsat Sahibi Firma silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteBranchHook.mutateAsync(id);
    },
    onSuccess: () => {
      // Tüm Ruhsat Sahibi Firma ile ilgili sorguları geçersiz kılarak UI güncellemelerini sağla
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
      toast.success("Başarılı", {
        description: "Ruhsat Sahibi Firma başarıyla silindi",
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Ruhsat Sahibi Firma silinirken bir hata oluştu",
      });
      console.error('Ruhsat Sahibi Firma silme hatası:', error);
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
