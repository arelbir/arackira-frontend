"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllHGS,
  useCreateHGS,
  useUpdateHGS,
  useDeleteHGS
} from './hgs-service';
import { HGS } from './hgs-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm HGS kayıtlarını getiren hook
export function useAllHGS() {
  const hgsHook = useGetAllHGS();

  useEffect(() => {
    if (hgsHook.error) {
      toast.error("Hata", {
        description: "HGS listesi yüklenirken bir hata oluştu",
      });
      console.error('HGS listesi yükleme hatası:', hgsHook.error);
    }
  }, [hgsHook.error]);

  return hgsHook;
}

// HGS verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useHGSMutations() {
  const queryClient = useQueryClient();

  const createHGSHook = useCreateHGS();
  const updateHGSHook = useUpdateHGS();
  const deleteHGSHook = useDeleteHGS();

  // Ekleme
  const addMutation = useMutation({
    mutationFn: async (data: Partial<HGS>) => {
      const res = await createHGSHook.mutateAsync(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hgs'] });
      toast.success('HGS kaydı eklendi');
    },
    onError: (error: any) => {
      toast.error('HGS eklenemedi', { description: error?.message });
    }
  });

  // Güncelleme
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<HGS> }) => {
      const res = await updateHGSHook.mutateAsync({ id, data });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hgs'] });
      toast.success('HGS kaydı güncellendi');
    },
    onError: (error: any) => {
      toast.error('HGS güncellenemedi', { description: error?.message });
    }
  });

  // Silme
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteHGSHook.mutateAsync(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hgs'] });
      toast.success('HGS kaydı silindi');
    },
    onError: (error: any) => {
      toast.error('HGS silinemedi', { description: error?.message });
    }
  });

  return { addMutation, updateMutation, deleteMutation };
}
