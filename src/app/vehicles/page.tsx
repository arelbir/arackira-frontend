import React from 'react';
import { useBrand, useModel, useColor } from '@/features/definitions/hooks';

export default function VehicleListPage() {
  // Bu örnekte sade bir listeleme için statik veri kullanılmıştır. Gerçek veri hook ile entegre edilebilir.
  // Örn: const { vehicles, loading } = useVehicle();
  const vehicles = [
    { id: 1, plate: '34ABC123', brand: 'Toyota', model: 'Corolla', color: 'Beyaz' },
    { id: 2, plate: '06DEF456', brand: 'Renault', model: 'Clio', color: 'Kırmızı' },
  ];

  return (
    <div>
      <h1>Araçlar</h1>
      <a href="/vehicles/create" className="btn btn-primary">Yeni Araç Ekle</a>
      <table>
        <thead>
          <tr>
            <th>Plaka</th>
            <th>Marka</th>
            <th>Model</th>
            <th>Renk</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.plate}</td>
              <td>{v.brand}</td>
              <td>{v.model}</td>
              <td>{v.color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
