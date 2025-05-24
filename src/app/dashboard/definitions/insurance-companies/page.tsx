// Sigorta Şirketleri Sayfası
'use client';
import React, { useState } from 'react';
import InsuranceCompanyList from '@/features/definitions/insurance-companies/insurance-company-list';
import InsuranceCompanyForm from '@/features/definitions/insurance-companies/insurance-company-form';
import { useInsuranceCompany } from '@/features/definitions/insurance-companies/useInsuranceCompany';
import { useAuth } from '@/hooks/useAuth';
import type { InsuranceCompany } from '@/features/definitions/insurance-companies/insuranceCompanyService';
import ProtectedRoute from '@/components/ProtectedRoute';

const InsuranceCompaniesPage = () => {
  const { token } = useAuth();
  const {
    insuranceCompanies,
    loading,
    addInsuranceCompany,
    editInsuranceCompany,
    removeInsuranceCompany
  } = useInsuranceCompany(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<InsuranceCompany> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (insuranceCompany: InsuranceCompany) => {
    setEditData(insuranceCompany);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editInsuranceCompany(editData.id, data);
    } else {
      await addInsuranceCompany(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (insuranceCompany: InsuranceCompany) => {
    await removeInsuranceCompany(insuranceCompany.id);
  };

  return (
    <ProtectedRoute>
      <InsuranceCompanyList
        insuranceCompanies={insuranceCompanies}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <InsuranceCompanyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default InsuranceCompaniesPage;
