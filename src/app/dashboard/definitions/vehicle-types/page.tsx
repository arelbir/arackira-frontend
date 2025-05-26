// Araç Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import VehicleTypeList from '@/features/definitions/vehicle-types/vehicle-type-list';
import VehicleTypeForm from '@/features/definitions/vehicle-types/vehicle-type-form';
import { useVehicleType } from '@/features/definitions/vehicle-types/useVehicleType';
import { useAuth } from '@/hooks/useAuth';
import type { VehicleType } from '@/features/definitions/vehicle-types/vehicleTypeService';
import ProtectedRoute from '@/components/ProtectedRoute';

const VehicleTypesPage = () => {
  const { token } = useAuth();
  const {
    vehicleTypes,
    loading,
    addVehicleType,
    editVehicleType,
    removeVehicleType
  } = useVehicleType(token); // token is string | null, handled in the hook

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<VehicleType> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (vehicleType: VehicleType) => {
    setEditData(vehicleType);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editVehicleType(editData.id, data);
    } else {
      await addVehicleType(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (vehicleType: VehicleType) => {
    await removeVehicleType(vehicleType.id);
  };

  return (
    <ProtectedRoute>
      <VehicleTypeList
        vehicleTypes={vehicleTypes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <VehicleTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default VehicleTypesPage;
