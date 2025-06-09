// Model Tanımları Sayfası
'use client';
import React, { useState } from 'react';
import { useModel } from '@/features/definitions/hooks';
import { useBrand } from '@/features/definitions/hooks';
import type { Model } from '@/features/definitions/models/model-schema';
import { useModelMutations } from '@/features/definitions/models/use-models';
import { ModelForm, ModelListWithBrandFilter, ModelDeleteConfirmDialog } from '@/features/definitions/models/components';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function ModelDefinitionsPage() {
  const {
    models,
    isLoading: modelsLoading,
    error: modelsError,
  } = useModel();

  // Brand context'i tipini olduğu gibi kullanarak isLoading düzeltelim
  const brandContext = useBrand();
  const brands = brandContext.brands;
  const brandsLoading = false; // Brand context'te loading bilgisi olmadığı için varsayılan false

  // Ortak UI yapısı ile uyumlu mutations hook'u kullan
  const { addModel, updateModel, deleteModel, isAddingModel, isUpdatingModel, isDeletingModel } = useModelMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  
  // Silme işlemi için onay dialog durumları
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);

  const handleAdd = () => {
    setEditingModel(null);
    setModalOpen(true);
  };
  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingModel(null);
    // setError kaldırıldı (artık merkezi yapıyı kullanıyoruz)
  };
  const handleSubmit = async (data: { brand_id: number; name: string; description?: string }) => {
    try {
      if (editingModel) {
        updateModel({ id: editingModel.id, data });
      } else {
        addModel(data);
      }
      setModalOpen(false);
      setEditingModel(null);
    } catch (err) {
      console.error('Model kaydedilirken hata oluştu:', err);
    }
  };
  // Model verilerini marka adlarıyla zenginleştir
  const modelsWithBrandNames = React.useMemo(() => {
    if (!models || !brands) return [];
    
    return models.map(model => {
      const brand = brands.find(b => b.id === model.brand_id);
      return {
        ...model,
        brand_name: brand ? brand.name : 'Bilinmeyen Marka'
      };
    });
  }, [models, brands]);

  // Silme işlemini başlat - dialog aç
  const handleDeleteClick = (model: Model) => {
    setModelToDelete(model);
    setConfirmDialogOpen(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (modelToDelete) {
      deleteModel(modelToDelete.id);
      setConfirmDialogOpen(false);
      setModelToDelete(null);
    }
  };

  // Silme işlemini iptal et
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setModelToDelete(null);
  };

  return (
    <div className='container mx-auto py-8 w-full'>
      <ModelListWithBrandFilter
        items={modelsWithBrandNames}
        brands={brands || []}
        loading={modelsLoading || brandsLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingModel ? 'Model Düzenle' : 'Yeni Model'}</SheetTitle>
          </SheetHeader>
          <ModelForm
            open={modalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            initialData={editingModel ? {
              brand_id: editingModel.brand_id,
              name: editingModel.name,
              description: editingModel.description
            } : undefined}
            loading={isAddingModel || isUpdatingModel}
            brands={brands || []}
          />
        </SheetContent>
      </Sheet>
      
      {/* Silme onay dialogs - reusable component */}
      <ModelDeleteConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        itemToDelete={modelToDelete}
        isDeleting={isDeletingModel}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
