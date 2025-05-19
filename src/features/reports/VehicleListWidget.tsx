'use client';
import React from 'react';
import { getVehicleListReport } from './reportsService';

export default function VehicleListWidget() {
  const [vehicles, setVehicles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    getVehicleListReport()
      .then((res) => {
        setVehicles(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='min-w-[320px] rounded-xl bg-white p-6 shadow dark:bg-neutral-900'>
      <div className='mb-2 text-xs text-gray-400 dark:text-gray-200'>
        Araç Listesi
      </div>
      {loading ? (
        <div className='text-gray-500'>Yükleniyor...</div>
      ) : error ? (
        <div className='text-sm text-red-600'>{error}</div>
      ) : vehicles.length === 0 ? (
        <div className='text-sm text-gray-500'>Kayıt yok</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white text-xs dark:bg-neutral-900'>
            <thead>
              <tr className='text-muted-foreground border-b text-left dark:border-gray-700 dark:text-gray-300'>
                <th className='px-2 py-1'>Plaka</th>
                <th className='px-2 py-1'>Marka</th>
                <th className='px-2 py-1'>Model</th>
                <th className='px-2 py-1'>Durum</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.slice(0, 5).map((v, idx) => (
                <tr
                  key={v.vehicle_id ?? v.id ?? idx}
                  className='border-b last:border-0 dark:border-gray-700'
                >
                  <td className='px-2 py-1'>{v.plate_number}</td>
                  <td className='px-2 py-1'>{v.brand}</td>
                  <td className='px-2 py-1'>{v.model}</td>
                  <td className='px-2 py-1'>{v.current_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {vehicles.length > 5 && (
            <div className='text-muted-foreground mt-2 text-xs'>
              ve {vehicles.length - 5} daha...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
