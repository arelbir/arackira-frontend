// Marka Tanımları Sayfası - ColorDefinitionsPage mantığında
'use client';
import React, { useState } from 'react';
import BrandList from '@/features/definitions/brands/brand-list';
import BrandForm from '@/features/definitions/brands/brand-form';
import { useBrand } from '@/features/definitions/brands/useBrand';
import type { Brand } from '@/features/definitions/brands/brandService';

export default function BrandDefinitionsPage() {
  const {
    brands,
    loading,
    error,
    addBrand,
    editBrand,
    removeBrand,
    setError
  } = useBrand();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleAdd = () => {
    setEditingBrand(null);
    setModalOpen(true);
  };
  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBrand(null);
    setError(null);
  };
  const handleSubmit = async (data: { name: string; description?: string }) => {
    if (editingBrand) {
      await editBrand(editingBrand.id, data);
    } else {
      await addBrand(data);
    }
    setModalOpen(false);
    setEditingBrand(null);
  };
  return (
    <div className='container mx-auto py-8 w-full'>
      <BrandList
        brands={brands}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={brand => removeBrand(brand.id)}
      />
      <BrandForm
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingBrand ? { name: editingBrand.name, description: editingBrand.description } : undefined}
        loading={loading}
      />
      {error && <div className='text-destructive mt-4'>{error}</div>}
    </div>
  );
}
