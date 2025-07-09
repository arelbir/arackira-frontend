'use client';

import React, { useState } from 'react';
import { FuelTypeList, FuelTypeForm, FuelTypeDeleteConfirmDialog } from '@/features/definitions/fuel-types/components';
import { useAllFuelTypes, useFuelTypeMutations } from '@/features/definitions/fuel-types/use-fuel-types';
import { FuelType, FuelTypeFormValues } from '@/features/definitions/fuel-types/fuel-type-schema';

export default function FuelTypeDefinitionsPage() {
  // State yönetimi
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // React Query hooks
  const { data: fuelTypes = [], isLoading } = useAllFuelTypes();
  const { addFuelType, updateFuelType, deleteFuelType, isAddingFuelType, isUpdatingFuelType, isDeletingFuelType } = useFuelTypeMutations();
  
  // Yükleme durumu
  const isFormLoading = isAddingFuelType || isUpdatingFuelType;
  const isDeleting = isDeletingFuelType;

  // Form açma/kapama işlemleri
  const handleOpenForm = (fuelType?: FuelType) => {
    setSelectedFuelType(fuelType || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedFuelType(null);
  };

  // Form gönderim işlemi
  const handleSubmitForm = (data: FuelTypeFormValues) => {
    if (selectedFuelType) {
      updateFuelType({ id: selectedFuelType.id, data });
    } else {
      addFuelType(data);
    }
    setIsFormOpen(false);
  };

  // Silme dialogu açma/kapama işlemleri
  const handleDeleteClick = (fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFuelType) {
      deleteFuelType(selectedFuelType.id);
    }
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <FuelTypeList
        items={fuelTypes} 
        loading={isLoading}
        onAdd={() => handleOpenForm()}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
      />

      <FuelTypeForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={selectedFuelType ? {
          name: selectedFuelType.name,
          description: selectedFuelType.description
        } : undefined}
        loading={isFormLoading}
      />

      <FuelTypeDeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen} 
        itemToDelete={selectedFuelType}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
