// Lastik Modelleri Sayfası
'use client';
import React, { useState } from 'react';
import TireModelList from '@/features/definitions/tire-models/tire-model-list';
import TireModelForm from '@/features/definitions/tire-models/tire-model-form';
import { useTireModel } from '@/features/definitions/tire-models/useTireModel';
import { useAuth } from '@/hooks/useAuth';
import type { TireModel } from '@/features/definitions/tire-models/tireModelService';
import ProtectedRoute from '@/components/ProtectedRoute';

const TireModelsPage = () => {
  const { token } = useAuth();
  const {
    tireModels,
    loading,
    addTireModel,
    editTireModel,
    removeTireModel
  } = useTireModel(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<TireModel> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tireModel: TireModel) => {
    setEditData(tireModel);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editTireModel(editData.id, data);
    } else {
      await addTireModel(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (tireModel: TireModel) => {
    await removeTireModel(tireModel.id);
  };

  return (
    <ProtectedRoute>
      <TireModelList
        tireModels={tireModels}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TireModelForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default TireModelsPage;
