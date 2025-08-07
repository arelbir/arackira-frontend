'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import * as ClientService from '../services/client.service';
import type { ClientCompanyFormValues } from '../schemas/client.schema';

export const useClientMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: createClient,
    isPending: isCreating,
  } = useMutation({
    mutationFn: (data: ClientCompanyFormValues) => {
      const cleanedData = { ...data };
      if (cleanedData.parent_company_id === null) {
        delete cleanedData.parent_company_id;
      }
      return ClientService.createClient(cleanedData);
    },
    onSuccess: () => {
      toast.success('Müşteri başarıyla oluşturuldu.');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push('/dashboard/clients');
    },
    onError: (error: any) => {
      console.error('Müşteri oluşturulurken hata:', error);
      toast.error(`Müşteri oluşturulamadı: ${error.message}`);
    },
  });

  const {
    mutate: updateClient,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientCompanyFormValues }) => {
      const cleanedData = { ...data };
      if (cleanedData.parent_company_id === null) {
        delete cleanedData.parent_company_id;
      }
      return ClientService.updateClient(Number(id), cleanedData);
    },
    onSuccess: (_data, variables) => {
      toast.success('Müşteri başarıyla güncellendi.');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', { id: Number(variables.id) }] });
      router.push('/dashboard/clients');
    },
    onError: (error: any) => {
      console.error('Müşteri güncellenirken hata:', error);
      toast.error(`Müşteri güncellenemedi: ${error.message}`);
    },
  });

  return {
    createClient,
    isCreating,
    updateClient,
    isUpdating,
  };
};
