// Vites Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import TransmissionList from '@/features/definitions/transmissions/transmission-list';
import TransmissionForm from '@/features/definitions/transmissions/transmission-form';
import { useTransmission } from '@/features/definitions/transmissions/useTransmission';
import { useAuth } from '@/hooks/useAuth';
import type { Transmission } from '@/features/definitions/transmissions/transmissionService';
import ProtectedRoute from '@/components/ProtectedRoute';

const TransmissionsPage = () => {
  const { token } = useAuth();
  const {
    transmissions,
    loading,
    addTransmission,
    editTransmission,
    removeTransmission
  } = useTransmission(token); // token is string | null, handled in the hook

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Transmission> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (transmission: Transmission) => {
    setEditData(transmission);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editTransmission(editData.id, data);
    } else {
      await addTransmission(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (transmission: Transmission) => {
    await removeTransmission(transmission.id);
  };

  return (
    <ProtectedRoute>
      <TransmissionList
        transmissions={transmissions}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <TransmissionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default TransmissionsPage;
