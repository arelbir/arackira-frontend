// Model Tanımları Sayfası
'use client';
import React, { useState } from 'react';
import ModelList from '@/features/definitions/models/model-list';
import ModelForm from '@/features/definitions/models/model-form';
import { useModel } from '@/features/definitions/models/useModel';
import type { Model } from '@/features/definitions/models/modelService';

export default function ModelDefinitionsPage() {
  const {
    models,
    brands,
    loading,
    error,
    addModel,
    editModel,
    removeModel,
    setError
  } = useModel();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  const handleAdd = () => {
    setEditingModel(null);
    setModalOpen(true);
  };
  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingModel(null);
    setError(null);
  };
  const handleSubmit = async (data: { brand_id: number; name: string; description?: string }) => {
    if (editingModel) {
      await editModel(editingModel.id, data);
    } else {
      await addModel(data);
    }
    setModalOpen(false);
    setEditingModel(null);
  };
  return (
    <div className='container mx-auto py-8 w-full'>
      <ModelList
        models={models}
        brands={brands}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={model => removeModel(model.id)}
      />
      <ModelForm
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingModel ? { brand_id: editingModel.brand_id, name: editingModel.name, description: editingModel.description } : undefined}
        brands={brands}
        loading={loading}
      />
      {error && <div className='text-destructive mt-4'>{error}</div>}
    </div>
  );
}
