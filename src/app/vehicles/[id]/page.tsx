import React from 'react';
import { useBrand, useModel, useColor } from '@/features/definitions/hooks';
// import { useVehicle } from '@/features/vehicle/hooks/useVehicle';

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  // const { vehicle, loading } = useVehicle(params.id);
  // Şimdilik örnek statik veri:
  const vehicle = { id: params.id, plate: '34ABC123', brandId: 1, modelId: 1, colorId: 1 };
  const { brands } = useBrand();
  const { models } = useModel();
  const { colors } = useColor();

  return (
    <div>
      <h1>Araç Detayı</h1>
      <div>Plaka: {vehicle.plate}</div>
      <div>Marka: {brands.find(b => b.id === vehicle.brandId)?.name}</div>
      <div>Model: {models.find(m => m.id === vehicle.modelId)?.name}</div>
      <div>Renk: {colors.find(c => c.id === vehicle.colorId)?.name}</div>
    </div>
  );
}
