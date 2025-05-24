// Lastik Markaları Sayfası
'use client';
import React, { useState } from 'react';
import TireBrandList from '@/features/definitions/tire-brands/tire-brand-list';
import TireBrandForm from '@/features/definitions/tire-brands/tire-brand-form';
import { useTireBrand } from '@/features/definitions/tire-brands/useTireBrand';
import { useAuth } from '@/hooks/useAuth';
import type { TireBrand } from '@/features/definitions/tire-brands/tireBrandService';
import ProtectedRoute from '@/components/ProtectedRoute';

const TireBrandsPage = () => {
  const { token } = useAuth();
  const {
    tireBrands,
    loading,
    addTireBrand,
    editTireBrand,
    removeTireBrand
  } = useTireBrand(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<TireBrand> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tireBrand: TireBrand) => {
    setEditData(tireBrand);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editTireBrand(editData.id, data);
    } else {
      await addTireBrand(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (tireBrand: TireBrand) => {
    await removeTireBrand(tireBrand.id);
  };

  return (
    <ProtectedRoute>
      <TireBrandList
        tireBrands={tireBrands}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TireBrandForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default TireBrandsPage;
