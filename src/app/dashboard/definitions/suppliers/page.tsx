// Tedarikçiler Sayfası
'use client';
import React, { useState } from 'react';
import SupplierList from '@/features/definitions/suppliers/supplier-list';
import { useSupplier } from '@/features/definitions/suppliers/useSupplier';
import { SupplierForm } from '@/features/definitions/suppliers/supplier-form';
import { Supplier } from '@/features/definitions/suppliers/supplierService';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

const SuppliersPage = () => {
  const { token } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const {
    suppliers,
    loading,
    addSupplier,
    editSupplier,
    removeSupplier,
  } = useSupplier(token);

  const handleAdd = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    removeSupplier(supplier.id);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingSupplier) {
        await editSupplier(editingSupplier.id, data);
      } else {
        await addSupplier(data);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Tedarikçi kaydedilemedi:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Tedarikçiler</h1>
        {token && (
          <>
            <SupplierList 
              suppliers={suppliers} 
              loading={loading}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            
            <SupplierForm
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              initialData={editingSupplier || undefined}
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default SuppliersPage;
