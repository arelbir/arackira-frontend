// Servis Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import ServiceTypeList from '@/features/definitions/service-types/service-type-list';
import ServiceTypeForm from '@/features/definitions/service-types/service-type-form';
import { useServiceType } from '@/features/definitions/service-types/useServiceType';
import { useAuth } from '@/hooks/useAuth';
import type { ServiceType } from '@/features/definitions/service-types/serviceTypeService';
import ProtectedRoute from '@/components/ProtectedRoute';

const ServiceTypesPage = () => {
  const { token } = useAuth();
  const {
    serviceTypes,
    loading,
    addServiceType,
    editServiceType,
    removeServiceType
  } = useServiceType(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<ServiceType> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (serviceType: ServiceType) => {
    setEditData(serviceType);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editServiceType(editData.id, data);
    } else {
      await addServiceType(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (serviceType: ServiceType) => {
    await removeServiceType(serviceType.id);
  };

  return (
    <ProtectedRoute>
      <ServiceTypeList
        serviceTypes={serviceTypes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ServiceTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default ServiceTypesPage;
