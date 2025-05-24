'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import VehicleStatusList from '@/features/definitions/vehicle-statuses/vehicle-status-list';
import VehicleStatusForm from '@/features/definitions/vehicle-statuses/vehicle-status-form';
import { useVehicleStatuses } from '@/features/definitions/vehicle-statuses/useVehicleStatuses';
import type { VehicleStatus } from '@/features/definitions/vehicle-statuses/vehicleStatusService';
import React, { useState } from 'react';

export default function VehicleStatusesPage() {
  const { vehicleStatuses, loading, error, addVehicleStatus, editVehicleStatus, removeVehicleStatus } = useVehicleStatuses();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleStatus | null>(null);

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const handleEdit = (vehicleStatus: VehicleStatus) => {
    setEditing(vehicleStatus);
    setFormOpen(true);
  };
  const handleDelete = (vehicleStatus: VehicleStatus) => {
    if (window.confirm('Silmek istediğinize emin misiniz?')) {
      removeVehicleStatus(vehicleStatus.id);
    }
  };
  const handleFormSubmit = async (data: Omit<VehicleStatus, 'id'>) => {
    if (editing) {
      await editVehicleStatus(editing.id, data);
    } else {
      await addVehicleStatus(data);
    }
    setFormOpen(false);
  };

  return (
    <ProtectedRoute role="admin">
      <div className="p-4">
        <h2 className="font-bold text-xl mb-4">Araç Statüleri</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <VehicleStatusList
          vehicleStatuses={vehicleStatuses as VehicleStatus[]}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <VehicleStatusForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editing || undefined}
          loading={loading}
        />
      </div>
    </ProtectedRoute>
  );
}
