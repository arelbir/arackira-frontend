import React from 'react';
import { useVehicle } from './hooks/useVehicle';
import { Vehicle } from './vehicleService';

import VehicleDetailModal from './VehicleDetailModal';
import ProtectedRoute from '@/components/ProtectedRoute';

const VehicleListPage: React.FC = () => {
  const { vehicles, loading, error } = useVehicle();

  const [detailVehicle, setDetailVehicle] = React.useState<any | null>(null);

    if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">Hata: {error}</div>;

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Araç Listesi</h1>
          <button
            className="bg-primary hover:bg-primary/90 ml-auto rounded px-5 py-2 font-semibold text-white"
            onClick={() => {
              // Eğer React Router kullanıyorsanız:
              // navigate('/vehicles/create');
              // Eğer Next.js kullanıyorsanız:
              window.location.href = '/vehicles/create';
            }}
          >
            Yeni Araç Ekle
          </button>
        </div>
        <table className="min-w-full border bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Plaka</th>
              <th className="p-2 border">Marka</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Şube</th>
              <th className="p-2 border">Renk</th>
              <th className="p-2 border">Durum</th>
              <th className="p-2 border">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v: any) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="p-2 border">{v.plate_number}</td>
                <td className="p-2 border">{v.brand_id}</td>
                <td className="p-2 border">{v.model_id}</td>
                <td className="p-2 border">{v.branch_id}</td>
                <td className="p-2 border">{v.color_id}</td>
                <td className="p-2 border">{v.current_status}</td>
                <td className="p-2 border text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mr-2"
                    onClick={() => setDetailVehicle(v)}
                  >
                    Detay
                  </button>
                  {/* Düzenle ve Sil butonları buraya eklenebilir */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {detailVehicle && (
          <VehicleDetailModal
            vehicle={detailVehicle}
            onClose={() => setDetailVehicle(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default VehicleListPage;
