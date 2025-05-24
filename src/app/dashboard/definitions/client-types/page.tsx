// Müşteri Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import ClientTypeList from '@/features/definitions/client-types/client-type-list';
import ClientTypeForm from '@/features/definitions/client-types/client-type-form';
import { useClientType } from '@/features/definitions/client-types/useClientType';
import { useAuth } from '@/hooks/useAuth';
import type { ClientType } from '@/features/definitions/client-types/clientTypeService';
import ProtectedRoute from '@/components/ProtectedRoute';

const ClientTypesPage = () => {
  const { token } = useAuth();
  const {
    clientTypes,
    loading,
    addClientType,
    editClientType,
    removeClientType
  } = useClientType(token); // token is string | null, handled in the hook

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<ClientType> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (clientType: ClientType) => {
    setEditData(clientType);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editClientType(editData.id, data);
    } else {
      await addClientType(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (clientType: ClientType) => {
    await removeClientType(clientType.id);
  };

  return (
    <ProtectedRoute>
      <ClientTypeList
        clientTypes={clientTypes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ClientTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default ClientTypesPage;
