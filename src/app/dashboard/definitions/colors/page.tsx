'use client';

import React, { useState } from 'react';
import { ColorList, ColorForm, ColorActionsMenu, ColorDeleteConfirmDialog } from '@/features/definitions/colors/components';
import { useAllColors, useColorMutations } from '@/features/definitions/colors/use-colors';
import DefinitionListToolbar from '@/features/definitions/DefinitionListToolbar';
import type { Color } from '@/features/definitions/colors/color-schema';

export default function ColorDefinitionsPage() {
  // State yönetimi
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // React Query hooks
  const { data: colors = [], isLoading } = useAllColors();
  const { addColor, updateColor, deleteColor, isPending } = useColorMutations();

  // Form açma/kapama işlemleri
  const handleOpenForm = (color?: Color) => {
    setSelectedColor(color || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedColor(null);
  };

  // Form gönderim işlemi
  const handleSubmitForm = (data: { name: string; description?: string }) => {
    if (selectedColor) {
      updateColor({ id: selectedColor.id, data });
    } else {
      addColor(data);
    }
    setIsFormOpen(false);
  };

  // Silme dialogu açma/kapama işlemleri
  const handleDeleteClick = (color: Color) => {
    setSelectedColor(color);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedColor) {
      deleteColor(selectedColor.id);
    }
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">

      <ColorList
        items={colors} 
        loading={isLoading}
        onAdd={() => handleOpenForm()}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
      />

      <ColorForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={selectedColor ? {
          name: selectedColor.name,
          description: selectedColor.description
        } : undefined}
        loading={isPending}
      />

      <ColorDeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen} 
        itemToDelete={selectedColor}
        isDeleting={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
