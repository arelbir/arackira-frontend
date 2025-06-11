'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllInsuranceCompanies,
  useGetInsuranceCompanyById,
  useCreateInsuranceCompany,
  useUpdateInsuranceCompany,
  useDeleteInsuranceCompany 
} from './insurance-company-service';
import { InsuranceCompany, InsuranceCompanyFormValues } from './insurance-company-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm sigorta şirketlerini getiren hook
export function useAllInsuranceCompanies() {
  // Hook örneği oluşturalım
  const insuranceCompaniesHook = useGetAllInsuranceCompanies();
  
  // Hata durumunu yönetmek için useEffect kullan
  useEffect(() => {
    if (insuranceCompaniesHook.error) {
      toast.error("Hata", {
        description: "Sigorta şirketleri yüklenirken bir hata oluştu",
      });
      console.error('Sigorta şirketleri yükleme hatası:', insuranceCompaniesHook.error);
    }
  }, [insuranceCompaniesHook.error]);

  return insuranceCompaniesHook;
}

// ID'ye göre tek bir sigorta şirketi getiren hook
export function useInsuranceCompanyById(id: number) {
  return useGetInsuranceCompanyById(id);
}

// Sigorta şirketi verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useInsuranceCompanyMutations() {
  const queryClient = useQueryClient();
  
  // Hook örneklerini oluşturalım
  const createInsuranceCompanyHook = useCreateInsuranceCompany();
  const updateInsuranceCompanyHook = useUpdateInsuranceCompany();
  const deleteInsuranceCompanyHook = useDeleteInsuranceCompany();

  // Sigorta şirketi ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<InsuranceCompany, 'id' | 'created_at'>) => {
      return createInsuranceCompanyHook.mutateAsync(data);
    },
    onSuccess: (newInsuranceCompany) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['insurance-companies-list']
      });
      // Tekli sorgu için önbelleği düzenle
      queryClient.setQueryData([`insurance-companies-item-${newInsuranceCompany.id}`], newInsuranceCompany);
      toast.success("Başarılı", {
        description: `${newInsuranceCompany.name} sigorta şirketi eklendi`
      });
    },
    onError: (error: Error) => {
      toast.error("Hata", {
        description: "Sigorta şirketi eklenirken bir hata oluştu"
      });
      console.error('Sigorta şirketi ekleme hatası:', error);
    }
  });

  // Sigorta şirketi güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Omit<InsuranceCompany, 'id' | 'created_at'> }) => {
      return updateInsuranceCompanyHook.mutateAsync({ id, data });
    },
    onSuccess: (updatedInsuranceCompany) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['insurance-companies-list']
      });
      // Tekli sorgu için önbelleği düzenle
      queryClient.setQueryData([`insurance-companies-item-${updatedInsuranceCompany.id}`], updatedInsuranceCompany);
      toast.success("Başarılı", {
        description: `${updatedInsuranceCompany.name} sigorta şirketi güncellendi`
      });
    },
    onError: (error: Error) => {
      toast.error("Hata", {
        description: "Sigorta şirketi güncellenirken bir hata oluştu"
      });
      console.error('Sigorta şirketi güncelleme hatası:', error);
    }
  });

  // Sigorta şirketi silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteInsuranceCompanyHook.mutateAsync(id);
    },
    onSuccess: (_, deletedId) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['insurance-companies-list']
      });
      // Silinen öğeyi önbellekten kaldır
      queryClient.removeQueries({ queryKey: [`insurance-companies-item-${deletedId}`] });
      toast.success("Başarılı", {
        description: "Sigorta şirketi silindi"
      });
    },
    onError: (error: Error) => {
      toast.error("Hata", {
        description: "Sigorta şirketi silinirken bir hata oluştu"
      });
      console.error('Sigorta şirketi silme hatası:', error);
    }
  });

  return {
    addInsuranceCompany: addMutation.mutate,
    updateInsuranceCompany: updateMutation.mutate,
    deleteInsuranceCompany: deleteMutation.mutate,
    isAddingInsuranceCompany: addMutation.isPending,
    isUpdatingInsuranceCompany: updateMutation.isPending,
    isDeletingInsuranceCompany: deleteMutation.isPending,
    error: addMutation.error || updateMutation.error || deleteMutation.error
  };
}
