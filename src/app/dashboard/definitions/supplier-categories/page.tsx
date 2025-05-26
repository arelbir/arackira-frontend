// Tedarikçi Kategorileri Sayfası
'use client';
import React, { useState } from 'react';
import SupplierCategoryList from '@/features/definitions/supplier-categories/supplier-category-list';
import SupplierCategoryForm from '@/features/definitions/supplier-categories/supplier-category-form';
import { useSupplierCategory } from '@/features/definitions/supplier-categories/useSupplierCategory';
import { useAuth } from '@/hooks/useAuth';
import type { SupplierCategory } from '@/features/definitions/supplier-categories/supplierCategoryService';
import ProtectedRoute from '@/components/ProtectedRoute';

const SupplierCategoriesPage = () => {
  const { token } = useAuth();
  const {
    supplierCategories,
    loading,
    addSupplierCategory,
    editSupplierCategory,
    removeSupplierCategory
  } = useSupplierCategory(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<SupplierCategory> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (supplierCategory: SupplierCategory) => {
    setEditData(supplierCategory);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editSupplierCategory(editData.id, data);
    } else {
      await addSupplierCategory(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (supplierCategory: SupplierCategory) => {
    await removeSupplierCategory(supplierCategory.id);
  };

  return (
    <ProtectedRoute>
      <SupplierCategoryList
        supplierCategories={supplierCategories}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <SupplierCategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default SupplierCategoriesPage;
