// Ajanslar Sayfası
'use client';
import React, { useState } from 'react';
import AgencyList from '@/features/definitions/agencies/agency-list';
import AgencyForm from '@/features/definitions/agencies/agency-form';
import { useAgency } from '@/features/definitions/agencies/useAgency';
import { useAuth } from '@/hooks/useAuth';
import type { Agency } from '@/features/definitions/agencies/agencyService';
import ProtectedRoute from '@/components/ProtectedRoute';

const AgenciesPage = () => {
  const { token } = useAuth();
  const {
    agencies,
    loading,
    addAgency,
    editAgency,
    removeAgency
  } = useAgency(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Agency> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (agency: Agency) => {
    setEditData(agency);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editAgency(editData.id, data);
    } else {
      await addAgency(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (agency: Agency) => {
    await removeAgency(agency.id);
  };

  return (
    <ProtectedRoute>
      <AgencyList
        agencies={agencies}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AgencyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default AgenciesPage;
