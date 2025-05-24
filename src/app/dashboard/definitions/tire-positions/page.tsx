// Lastik Pozisyonları Sayfası
'use client';
import React, { useState } from 'react';
import TirePositionList from '@/features/definitions/tire-positions/tire-position-list';
import TirePositionForm from '@/features/definitions/tire-positions/tire-position-form';
import { useTirePosition } from '@/features/definitions/tire-positions/useTirePosition';
import { useAuth } from '@/hooks/useAuth';
import type { TirePosition } from '@/features/definitions/tire-positions/tirePositionService';
import ProtectedRoute from '@/components/ProtectedRoute';

const TirePositionsPage = () => {
  const { token } = useAuth();
  const {
    tirePositions,
    loading,
    addTirePosition,
    editTirePosition,
    removeTirePosition
  } = useTirePosition(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<TirePosition> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (tirePosition: TirePosition) => {
    setEditData(tirePosition);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editTirePosition(editData.id, data);
    } else {
      await addTirePosition(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (tirePosition: TirePosition) => {
    await removeTirePosition(tirePosition.id);
  };

  return (
    <ProtectedRoute>
      <TirePositionList
        tirePositions={tirePositions}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TirePositionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default TirePositionsPage;
