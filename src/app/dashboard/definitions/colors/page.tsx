'use client';
import React, { useState } from 'react';
import ColorList from '@/features/definitions/colors/color-list';
import ColorForm from '@/features/definitions/colors/color-form';
import { useColor } from '@/features/definitions/colors/useColor';
import type { Color } from '@/features/definitions/colors/useColor';

export default function ColorDefinitionsPage() {
  const {
    colors,
    loading,
    error,
    addColor,
    editColor,
    removeColor,
    setError
  } = useColor();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  const handleAdd = () => {
    setEditingColor(null);
    setModalOpen(true);
  };
  const handleEdit = (color: Color) => {
    setEditingColor(color);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingColor(null);
    setError(null);
  };
  const handleSubmit = async (data: { name: string; description?: string }) => {
    if (editingColor) {
      await editColor(editingColor.id, data);
    } else {
      await addColor(data);
    }
    setModalOpen(false);
    setEditingColor(null);
  };
  return (
    <div className='container mx-auto py-8 w-full'>
      <ColorList
        colors={colors}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={color => removeColor(color.id)}
      />
      <ColorForm
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingColor ? { name: editingColor.name, description: editingColor.description } : undefined}
        loading={loading}
      />
      {error && <div className='text-destructive mt-4'>{error}</div>}
    </div>
  );
}
