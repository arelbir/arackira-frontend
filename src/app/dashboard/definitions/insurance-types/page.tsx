// Sigorta Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import InsuranceTypeList from '@/features/definitions/insurance-types/insurance-type-list';
import InsuranceTypeForm from '@/features/definitions/insurance-types/insurance-type-form';
import { useInsuranceType } from '@/features/definitions/insurance-types/useInsuranceType';
import { useAuth } from '@/hooks/useAuth';
import type { InsuranceType } from '@/features/definitions/insurance-types/insuranceTypeService';
import ProtectedRoute from '@/components/ProtectedRoute';

const InsuranceTypesPage = () => {
  const { token } = useAuth();
  const {
    insuranceTypes,
    loading,
    addInsuranceType,
    editInsuranceType,
    removeInsuranceType
  } = useInsuranceType(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<InsuranceType> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (insuranceType: InsuranceType) => {
    setEditData(insuranceType);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editInsuranceType(editData.id, data);
    } else {
      await addInsuranceType(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (insuranceType: InsuranceType) => {
    await removeInsuranceType(insuranceType.id);
  };

  return (
    <ProtectedRoute>
      <InsuranceTypeList
        insuranceTypes={insuranceTypes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <InsuranceTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default InsuranceTypesPage;
