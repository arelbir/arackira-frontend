// Sigorta Tipleri Sayfası
'use client';

import React, { useState, useMemo } from 'react';
import { InsuranceTypeList, InsuranceTypeForm, InsuranceTypeDeleteConfirmDialog } from '@/features/definitions/insurance-types/components';
import { useAllInsuranceTypes, useInsuranceTypeMutations } from '@/features/definitions/insurance-types/use-insurance-types';
import { InsuranceType, InsuranceTypeFormValues } from '@/features/definitions/insurance-types/insurance-type-schema';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function InsuranceTypeDefinitionsPage() {
  // Durum değişkenleri
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InsuranceType | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InsuranceType | null>(null);

  // Veri hook'ları
  const { data: insuranceTypes = [], isLoading } = useAllInsuranceTypes();
  const { 
    addInsuranceType, 
    updateInsuranceType, 
    deleteInsuranceType,
    isAddingInsuranceType,
    isUpdatingInsuranceType,
    isDeletingInsuranceType
  } = useInsuranceTypeMutations();
  
  // Form işlemleri
  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: InsuranceType) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (data: InsuranceTypeFormValues) => {
    try {
      if (editingItem) {
        updateInsuranceType({ id: editingItem.id, data });
      } else {
        addInsuranceType(data);
      }
      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Sigorta tipi kaydedilirken hata oluştu:', err);
    }
  };

  // Silme işlemleri
  const handleDeleteClick = (item: InsuranceType) => {
    setItemToDelete(item);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteInsuranceType(itemToDelete.id);
      setConfirmDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setItemToDelete(null);
  };

  // Sigorta tiplerini optimize etmek için useMemo kullan
  const processedItems = useMemo(() => {
    return insuranceTypes.map(item => ({
      ...item,
    }));
  }, [insuranceTypes]);

  return (
    <ProtectedRoute>
      <div className='container mx-auto py-8 w-full'>
        <InsuranceTypeList
        items={processedItems}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Sigorta Tipi Düzenle' : 'Yeni Sigorta Tipi'}</SheetTitle>
          </SheetHeader>
          <InsuranceTypeForm
            open={modalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            initialData={editingItem ? {
              name: editingItem.name,
              description: editingItem.description
            } : undefined}
            loading={isAddingInsuranceType || isUpdatingInsuranceType}
          />
        </SheetContent>
      </Sheet>

      <InsuranceTypeDeleteConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        itemToDelete={itemToDelete}
        isDeleting={isDeletingInsuranceType}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      </div>
    </ProtectedRoute>
  );
}
