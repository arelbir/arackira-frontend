# Modül Refaktör Kılavuzu

Bu doküman, eski modülleri React Query, Zod ve factory-based yapıya uygun şekilde refactor etmek için hazırlanmış bir kılavuzdur.

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Adım-Adım Refaktor](#adım-adım-refaktor)
3. [Dikkat Edilecek Noktalar](#dikkat-edilecek-noktalar)
4. [Örnek Modüller](#örnek-modüller)

## Genel Bakış

Refaktor edilen modüller aşağıdaki prensipleri takip etmelidir:

- **DRY Prensibi**: Tekrar eden kod yapısını önlemek için tanım servisleri için ortak factory yapısı kullanılmalı
- **React Query**: Veri yükleme, önbellekleme ve invalidasyon için tutarlı yaklaşım
- **Zod Şemaları**: Veri doğrulama ve tip güvenliği için şema kullanımı
- **Kebab-Case Dosya İsimleri**: Dosya adlandırmada tutarlılık
- **Sheet UI Komponenti**: Form gösterimi için tutarlı bir UI deseni
- **Tost Bildirimleri**: Kullanıcı geri bildirimi için tutarlı bir yaklaşım

## Adım-Adım Refaktor

### 1. Şema Dosyası Oluşturma (`module-schema.ts`)

```typescript
import { z } from 'zod';

// API yanıtı için şema
export const ModuleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string()
  // Diğer alanlar buraya eklenebilir
});

// Form değerleri için şema
export const moduleSchema = z.object({
  name: z.string().min(2, 'Alan adı en az 2 karakter olmalı'),
  description: z.string().optional()
  // Diğer form alanları buraya eklenebilir
});

// Tip tanımları
export type Module = z.infer<typeof ModuleSchema>;
export type ModuleFormValues = z.infer<typeof moduleSchema>;

// Servis bağlantıları için yardımcı fonksiyon
export const moduleExports = (service: any) => service;
```

### 2. Servis Dosyası Oluşturma (`module-service.ts`)

```typescript
'use client';

import { createDefinitionService } from '../../../lib/definition-service-factory';
import { Module, ModuleSchema } from './module-schema';

// Servis fabrikasından yeni servis oluşturma
const moduleService = createDefinitionService<Module>('modules', ModuleSchema);

// Hook bazlı servis fonksiyonlarını dışa aktarma
export const useGetAllModules = moduleService.useGetAll;
export const useGetModuleById = moduleService.useGetById;
export const useCreateModule = moduleService.useCreate;
export const useUpdateModule = moduleService.useUpdate;
export const useDeleteModule = moduleService.useDelete;

// Sayfalar için kolaylık sağlayan hook'lar
export const useAllModules = moduleService.useGetAll;

// UYARI: Unutmayın query anahtarları şöyle tanımlanır:
// - Liste için: `${endpoint}-list` (örn: modules-list)
// - Tekil öğe için: `${endpoint}-item-${id}` (örn: modules-item-1)

// Tüm mutasyon işlemlerini tek bir hook'ta dışa aktar
export const useModuleMutations = () => {
  const createMutation = useCreateModule();
  const updateMutation = useUpdateModule();
  const deleteMutation = useDeleteModule();
  
  return {
    addModule: createMutation.mutate,
    updateModule: updateMutation.mutate,
    deleteModule: deleteMutation.mutate,
    isAddingModule: createMutation.isPending,
    isUpdatingModule: updateMutation.isPending,
    isDeletingModule: deleteMutation.isPending,
  };
};

// Geriye dönük uyumluluk için fonksiyonlar
export const getAllModules = async (): Promise<Module[]> => {
  return moduleService.getAll();
};

export const getModuleById = async (id: number): Promise<Module | null> => {
  return moduleService.getById(id);
};

export const createModule = async (data: Omit<Module, 'id' | 'created_at'>): Promise<Module> => {
  return moduleService.create(data);
};

export const updateModule = async (id: number, data: Omit<Module, 'id' | 'created_at'>): Promise<Module> => {
  return moduleService.update(id, data);
};

export const deleteModule = async (id: number): Promise<{ success: boolean }> => {
  return moduleService.delete(id);
};
```

### 3. Veri Yönetimi ve Mutation Hook'ları (`use-module.ts`)

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useGetAllModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule 
} from './module-service';
import { Module } from './module-schema';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Tüm modülleri getiren hook
export function useAllModules() {
  const modulesHook = useGetAllModules();
  
  useEffect(() => {
    if (modulesHook.error) {
      toast.error("Hata", {
        description: "Modül listesi yüklenirken bir hata oluştu",
      });
      console.error('Modül listesi yükleme hatası:', modulesHook.error);
    }
  }, [modulesHook.error]);

  return modulesHook;
}

// Modül verilerini eklemek, güncellemek ve silmek için mutation hook'ları
export function useModuleMutations() {
  const queryClient = useQueryClient();
  
  const createModuleHook = useCreateModule();
  const updateModuleHook = useUpdateModule();
  const deleteModuleHook = useDeleteModule();

  // Modül ekleme
  const addMutation = useMutation({
    mutationFn: (data: Omit<Module, 'id' | 'created_at'>) => {
      return createModuleHook.mutateAsync(data);
    },
    onSuccess: (newModule) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['modules-list']
      });
      // Tekli sorgu için önbelleği düzenle
      queryClient.setQueryData([`modules-item-${newModule.id}`], newModule);
      toast.success("Başarılı", {
        description: `${newModule.name} modülü eklendi`
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Modül eklenirken bir hata oluştu",
      });
      console.error('Modül ekleme hatası:', error);
    }
  });

  // Modül güncelleme
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Omit<Module, 'id' | 'created_at'>> }) => {
      return updateModuleHook.mutateAsync({ id, data });
    },
    onSuccess: (updatedModule) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['modules-list']
      });
      // Tekli sorgu için önbelleği düzenle
      queryClient.setQueryData([`modules-item-${updatedModule.id}`], updatedModule);
      toast.success("Başarılı", {
        description: `${updatedModule.name} modülü güncellendi`
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Modül güncellenirken bir hata oluştu",
      });
      console.error('Modül güncelleme hatası:', error);
    }
  });

  // Modül silme
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteModuleHook.mutateAsync(id);
    },
    onSuccess: (_, deletedId) => {
      // Önbelleği güncelle - tüm ilgili sorguları temizle
      queryClient.invalidateQueries({ 
        queryKey: ['modules-list']
      });
      // Silinen öğeyi önbellekten kaldır
      queryClient.removeQueries({ queryKey: [`modules-item-${deletedId}`] });
      toast.success("Başarılı", {
        description: "Modül silindi"
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description: "Modül silinirken bir hata oluştu",
      });
      console.error('Modül silme hatası:', error);
    }
  });

  return {
    addModule: addMutation.mutate,
    updateModule: updateMutation.mutate,
    deleteModule: deleteMutation.mutate,
    isAddingModule: addMutation.isPending,
    isUpdatingModule: updateMutation.isPending,
    isDeletingModule: deleteMutation.isPending,
  };
}
```

### 4. Sayfa Bileşeni (`page.tsx`)

```tsx
"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useAllModules, useModuleMutations } from "@/features/definitions/modules/use-modules";
import { Module } from "@/features/definitions/modules/module-schema";
import { ModuleForm } from "@/features/definitions/modules/module-form";
import { columns } from "./columns";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";

export default function ModulesPage() {
  // State tanımları
  const [modalOpen, setModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);

  // Veri yükleme ve işlem hook'ları
  const { data: modules, isLoading } = useAllModules();
  const {
    addModule,
    updateModule,
    deleteModule,
    isAddingModule,
    isUpdatingModule,
    isDeletingModule,
  } = useModuleMutations();

  // Veriyi memoize ederek gereksiz yeniden-render'ları önleyelim
  const tableData = useMemo(() => modules || [], [modules]);

  // Fonksiyonlar
  const handleCreate = () => {
    setEditingModule(null);
    setModalOpen(true);
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingModule(null);
    setModalOpen(false);
  };

  const handleSubmit = (values: any) => {
    if (editingModule) {
      updateModule({ id: editingModule.id, data: values });
    } else {
      addModule(values);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: number) => {
    setModuleToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (moduleToDelete) {
      deleteModule(moduleToDelete);
      setConfirmDialogOpen(false);
      setModuleToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modüller</h1>
        <Button onClick={handleCreate}>
          <IconPlus className="mr-2 h-4 w-4" /> Yeni Ekle
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDeleteClick,
          })}
          data={tableData}
        />
      )}

      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingModule ? "Modül Düzenle" : "Yeni Modül Ekle"}
            </SheetTitle>
          </SheetHeader>
          <ModuleForm 
              onSubmit={handleSubmit}
              initialData={editingModule ? {
                name: editingModule.name,
                description: editingModule.description
              } : undefined}
              loading={isAddingModule || isUpdatingModule}
            />
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu modülü silmek istediğinizden emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeletingModule}
            >
              {isDeletingModule ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

## Dikkat Edilecek Noktalar

1. **Query Anahtarları**: En önemli kısım, React Query query anahtarlarının tutarlı olmasıdır.
   - Liste sorguları: `${endpoint}-list` (örneğin: `insurance-companies-list`) 
   - Tekil öğe sorguları: `${endpoint}-item-${id}` (örneğin: `insurance-companies-item-123`)

2. **Önbellek İşlemleri**:
   - Yeni veri eklendiğinde/güncellendiğinde: `invalidateQueries` ile liste önbelleğini temizleyip `setQueryData` ile tekil öğeyi güncelleyin
   - Veri silindiğinde: `invalidateQueries` ile liste önbelleğini temizleyip `removeQueries` ile tekil öğeyi silin

3. **Tutarlı UI Deseni**:
   - `Sheet` komponenti formlar için
   - `AlertDialog` silme işlemleri için
   - Toast bildirimleri tüm sonuçlar için

4. **Dosya İsimlendirme Kuralı**: Kebab-case kullanın (örneğin: `insurance-company-service.ts`, `use-insurance-companies.ts`)

## Örnek Modüller

Referans olarak aşağıdaki modülleri inceleyebilirsiniz:

1. **Models Modülü** - Düzgün refactor edilmiş örnek
2. **Insurance Companies Modülü** - Refactor edilmiş örnek
3. **Insurance Types Modülü** - Refactor edilmiş örnek

## Sorun Giderme

Veri ekleme sonrası UI güncellenmiyorsa:
- React Query önbellek anahtarlarını kontrol edin
- `definition-service-factory.ts` dosyasındaki anahtar format yapısını izleyin
- `invalidateQueries`, `setQueryData` ve `removeQueries` çağrılarında doğru anahtarları kullandığınızdan emin olun
