// Marka Tanımları Sayfası
'use client';
import React, { useState } from 'react';
import { useAllBrands, useBrandMutations } from '@/features/definitions/brands/use-brands';
import type { Brand } from '@/features/definitions/brands/brand-service';
import { BrandList, BrandForm, BrandDeleteConfirmDialog } from '@/features/definitions/brands/components';

export default function BrandDefinitionsPage() {
  // Markalar verilerini al
  const {
    data: brands = [],
    isLoading: brandsLoading,
    error: brandsError,
  } = useAllBrands();

  // Ortak UI yapısı ile uyumlu mutations hook'u kullan
  const { 
    addBrand, 
    updateBrand, 
    deleteBrand, 
    isPending 
  } = useBrandMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  // Silme onay diyalogu için state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

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
  };
  const handleSubmit = (data: { name: string; description?: string }) => {
    try {
      if (editingBrand) {
        updateBrand({ id: editingBrand.id, data });
      } else {
        addBrand(data);
      }
      setModalOpen(false);
      setEditingBrand(null);
    } catch (err) {
      console.error('Marka kaydedilirken hata oluştu:', err);
    }
  };
  // Silme işlemini başlat - dialog aç
  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setConfirmDialogOpen(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (brandToDelete) {
      deleteBrand(brandToDelete.id);
      setConfirmDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  // Silme işlemini iptal et
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setBrandToDelete(null);
  };

  return (
    <div className='container mx-auto py-8 w-full'>
      <BrandList
        items={brands}
        loading={brandsLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <BrandForm
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingBrand ? { name: editingBrand.name, description: editingBrand.description } : undefined}
        loading={isPending}
      />
      
      {/* Silme onay dialogs - reusable component */}
      <BrandDeleteConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        itemToDelete={brandToDelete}
        isDeleting={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      
      {brandsError && <div className='text-destructive mt-4'>{String(brandsError)}</div>}
    </div>
  );
}
