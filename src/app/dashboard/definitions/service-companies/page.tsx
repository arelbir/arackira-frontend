// Servis Şirketleri Sayfası
'use client';
import React, { useState } from 'react';
import ServiceCompanyList from '@/features/definitions/service-companies/service-company-list';
import ServiceCompanyForm from '@/features/definitions/service-companies/service-company-form';
import { useServiceCompany } from '@/features/definitions/service-companies/useServiceCompany';
import { useAuth } from '@/hooks/useAuth';
import type { ServiceCompany } from '@/features/definitions/service-companies/serviceCompanyService';
import ProtectedRoute from '@/components/ProtectedRoute';

const ServiceCompaniesPage = () => {
  const { token } = useAuth();
  const {
    serviceCompanies,
    loading,
    addServiceCompany,
    editServiceCompany,
    removeServiceCompany
  } = useServiceCompany(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<ServiceCompany> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (serviceCompany: ServiceCompany) => {
    setEditData(serviceCompany);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editServiceCompany(editData.id, data);
    } else {
      await addServiceCompany(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (serviceCompany: ServiceCompany) => {
    await removeServiceCompany(serviceCompany.id);
  };

  return (
    <ProtectedRoute>
      <ServiceCompanyList
        serviceCompanies={serviceCompanies}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ServiceCompanyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default ServiceCompaniesPage;
