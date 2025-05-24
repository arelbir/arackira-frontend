// Yakıt Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import FuelTypeList from '@/features/definitions/fuel-types/fuel-type-list';
import FuelTypeForm from '@/features/definitions/fuel-types/fuel-type-form';
import { useFuelType } from '@/features/definitions/fuel-types/useFuelType';
import { useAuth } from '@/hooks/useAuth';
import type { FuelType } from '@/features/definitions/fuel-types/fuelTypeService';
import ProtectedRoute from '@/components/ProtectedRoute';

const FuelTypesPage = () => {
  const { token } = useAuth();
  const {
    fuelTypes,
    loading,
    addFuelType,
    editFuelType,
    removeFuelType
  } = useFuelType(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<FuelType> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (fuelType: FuelType) => {
    setEditData(fuelType);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editFuelType(editData.id, data);
    } else {
      await addFuelType(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (fuelType: FuelType) => {
    await removeFuelType(fuelType.id);
  };

  return (
    <ProtectedRoute>
      <FuelTypeList
        fuelTypes={fuelTypes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <FuelTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default FuelTypesPage;
