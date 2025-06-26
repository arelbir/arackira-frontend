'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ZodType } from 'zod';

/**
 * Tanım hook tiplerini
 */
interface UseDefinitionProps<T extends { id: number }> {
  // Servis fonksiyonları
  service: {
    getAll: () => { queryFn: () => Promise<T[]>, enabled: boolean, queryKey: any[] };
    getById?: (id: number) => { queryFn: () => Promise<T>, enabled: boolean, queryKey: any[] };
    create: () => { mutationFn: (data: any) => Promise<T>, onSuccess?: any };
    update: () => { mutationFn: (data: { id: number, data: any }) => Promise<T>, onSuccess?: any };
    delete: () => { mutationFn: (id: number) => Promise<any>, onSuccess?: any };
  };
  
  // Tanım ismi
  entityName: {
    singular: string; // Tekil isim (örn: "Marka")
    plural: string;   // Çoğul isim (örn: "Markalar")
  };
  
  // Toast mesajları, varsayılan değerler kullanılabilir
  toastMessages?: {
    loading?: {
      create?: string;
      update?: string;
      delete?: string;
    };
    success?: {
      create?: string;
      update?: string;
      delete?: string;
      fetch?: string;
    };
    error?: {
      create?: string;
      update?: string;
      delete?: string;
      fetch?: string;
    };
  };
  
  // Başarılı işlemlerde çağrılacak fonksiyonlar
  onSuccess?: {
    create?: (data: T) => void;
    update?: (data: T) => void;
    delete?: (id: number) => void;
  };
  
  // Şema doğrulama
  schema?: ZodType<any>;
}

/**
 * Tanım modülleri için genel hook
 * 
 * Form işlemleri, veri yönetimi, mutasyonlar ve bildirimler sağlar
 * 
 * @param props Hook konfigürasyonu
 * @returns Hook API'si ve state'i
 */
export function useDefinition<T extends { id: number; name: string }>({
  service,
  entityName,
  toastMessages = {},
  onSuccess = {},
  schema
}: UseDefinitionProps<T>) {
  // State
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<T | undefined>(undefined);
  const queryClient = useQueryClient();

  // Varsayılan mesajlar
  const messages = {
    loading: {
      create: `${entityName.singular} ekleniyor...`,
      update: `${entityName.singular} güncelleniyor...`,
      delete: `${entityName.singular} siliniyor...`,
      ...toastMessages.loading
    },
    success: {
      create: `${entityName.singular} başarıyla eklendi.`,
      update: `${entityName.singular} başarıyla güncellendi.`,
      delete: `${entityName.singular} başarıyla silindi.`,
      fetch: `${entityName.plural} yüklendi.`,
      ...toastMessages.success
    },
    error: {
      create: `${entityName.singular} eklenirken hata oluştu.`,
      update: `${entityName.singular} güncellenirken hata oluştu.`,
      delete: `${entityName.singular} silinirken hata oluştu.`,
      fetch: `${entityName.plural} yüklenirken hata oluştu.`,
      ...toastMessages.error
    }
  };

  // Query ve Mutations
  const {
    data = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: service.getAll().queryKey,
    queryFn: service.getAll().queryFn,
    enabled: service.getAll().enabled,
    onError: () => {
      toast.error('Hata', {
        description: messages.error.fetch
      });
    }
  } as UseQueryOptions<T[], Error>);

  // Ekleme mutasyonu
  const createMutation = useMutation({
    mutationFn: (data: Omit<T, 'id' | 'created_at'>) => {
      return service.create().mutationFn(data);
    },
    onSuccess: (createdItem) => {
      toast.success('Başarılı', {
        description: messages.success.create
      });
      
      queryClient.invalidateQueries({ queryKey: service.getAll().queryKey });
      
      if (onSuccess.create) {
        onSuccess.create(createdItem);
      }
      
      setFormOpen(false);
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Hata', {
        description: messages.error.create
      });
    }
  });

  // Güncelleme mutasyonu
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<T, 'id' | 'created_at'>> }) => {
      return service.update().mutationFn({ id, data });
    },
    onSuccess: (updatedItem) => {
      toast.success('Başarılı', {
        description: messages.success.update
      });
      
      queryClient.invalidateQueries({ queryKey: service.getAll().queryKey });
      
      if (onSuccess.update) {
        onSuccess.update(updatedItem);
      }
      
      setFormOpen(false);
      setSelectedItem(undefined);
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Hata', {
        description: messages.error.update
      });
    }
  });

  // Silme mutasyonu
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return service.delete().mutationFn(id);
    },
    onSuccess: (_, deletedId) => {
      toast.success('Başarılı', {
        description: messages.success.delete
      });
      
      queryClient.invalidateQueries({ queryKey: service.getAll().queryKey });
      
      if (onSuccess.delete) {
        onSuccess.delete(deletedId);
      }
      
      setConfirmDelete(undefined);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Hata', {
        description: messages.error.delete
      });
    }
  });

  // Event Handler'lar
  const handleAdd = () => {
    setSelectedItem(undefined);
    setFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: T) => {
    setConfirmDelete(item);
  };

  const handleFormSubmit = async (data: Omit<T, 'id' | 'created_at'>) => {
    if (selectedItem) {
      await updateMutation.mutateAsync({ id: selectedItem.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const confirmDeleteHandler = async () => {
    if (confirmDelete) {
      await deleteMutation.mutateAsync(confirmDelete.id);
    }
  };

  return {
    // Data
    items: data,
    selectedItem,
    
    // UI State
    formOpen,
    confirmDelete,
    isLoading: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    isError,
    
    // Event handlers
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    confirmDeleteHandler,
    
    // UI control
    setFormOpen,
    setConfirmDelete,
    
    // Data actions
    refetch
  };
}
