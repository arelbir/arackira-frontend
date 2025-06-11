"use client";

import { useQuery } from '@tanstack/react-query';
import { VehiclePackage, getPackagesByModel } from './package-service';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function usePackagesByModel(modelId: number | null) {
  const result = useQuery<VehiclePackage[]>({
    queryKey: ['packages', 'model', modelId],
    queryFn: async () => {
      if (!modelId) return [];
      return getPackagesByModel(modelId);
    },
    enabled: !!modelId,
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme
  });

  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (result.error) {
      toast.error("Hata", {
        description: "Paket listesi yüklenirken bir hata oluştu",
      });
      console.error('Paket listesi yükleme hatası:', result.error);
    }
  }, [result.error]);

  return result;
}
