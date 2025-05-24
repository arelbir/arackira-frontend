// Lastik Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import TireTypeList from '@/features/definitions/tire-types/tire-type-list';
import TireTypeForm from '@/features/definitions/tire-types/tire-type-form';
import { useTireType } from '@/features/definitions/tire-types/useTireType';
import { useAuth } from '@/hooks/useAuth';
import type { TireType } from '@/features/definitions/tire-types/tireTypeService';
import ProtectedRoute from '@/components/ProtectedRoute';

const TireTypesPage = () => {
  const { token } = useAuth();
  const {
    tireTypes,
    loading,
    addTireType,
    editTireType,
    removeTireType
  } = useTireType(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<TireType> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tireType: TireType) => {
    setEditData(tireType);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editTireType(editData.id, data);
    } else {
      await addTireType(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (tireType: TireType) => {
    await removeTireType(tireType.id);
  };

  return (
    <ProtectedRoute>
      <TireTypeList
        tireTypes={tireTypes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TireTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default TireTypesPage;
