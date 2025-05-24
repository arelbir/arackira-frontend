// Lastik Durumları Sayfası
'use client';
import React, { useState } from 'react';
import TireConditionList from '@/features/definitions/tire-conditions/tire-condition-list';
import TireConditionForm from '@/features/definitions/tire-conditions/tire-condition-form';
import { useTireCondition } from '@/features/definitions/tire-conditions/useTireCondition';
import { useAuth } from '@/hooks/useAuth';
import type { TireCondition } from '@/features/definitions/tire-conditions/tireConditionService';
import ProtectedRoute from '@/components/ProtectedRoute';

const TireConditionsPage = () => {
  const { token } = useAuth();
  const {
    tireConditions,
    loading,
    addTireCondition,
    editTireCondition,
    removeTireCondition
  } = useTireCondition(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<TireCondition> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tireCondition: TireCondition) => {
    setEditData(tireCondition);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editTireCondition(editData.id, data);
    } else {
      await addTireCondition(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (tireCondition: TireCondition) => {
    await removeTireCondition(tireCondition.id);
  };

  return (
    <ProtectedRoute>
      <TireConditionList
        tireConditions={tireConditions}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TireConditionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default TireConditionsPage;
