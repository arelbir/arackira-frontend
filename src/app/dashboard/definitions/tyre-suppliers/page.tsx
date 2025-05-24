// Tedarikçiler Sayfası
'use client';
import React, { useState } from 'react';
import TyreSupplierList from '@/features/definitions/tyre-suppliers/tyre-supplier-list';
import TyreSupplierForm from '@/features/definitions/tyre-suppliers/tyre-supplier-form';
import { useTyreSupplier } from '@/features/definitions/tyre-suppliers/useTyreSupplier';
import { useAuth } from '@/hooks/useAuth';
import type { TyreSupplier } from '@/features/definitions/tyre-suppliers/tyreSupplierService';
import ProtectedRoute from '@/components/ProtectedRoute';

const TyreSuppliersPage = () => {
  const { token } = useAuth();
  const {
    tyreSuppliers,
    loading,
    addTyreSupplier,
    editTyreSupplier,
    removeTyreSupplier
  } = useTyreSupplier(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<TyreSupplier> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tyreSupplier: TyreSupplier) => {
    setEditData(tyreSupplier);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editTyreSupplier(editData.id, data);
    } else {
      await addTyreSupplier(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (tyreSupplier: TyreSupplier) => {
    await removeTyreSupplier(tyreSupplier.id);
  };

  return (
    <ProtectedRoute>
      <TyreSupplierList
        tyreSuppliers={tyreSuppliers}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TyreSupplierForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default TyreSuppliersPage;
