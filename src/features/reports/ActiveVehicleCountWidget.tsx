'use client';
import React from 'react';
import { getActiveVehicleCountReport } from './reportsService';

export default function ActiveVehicleCountWidget() {
  const [count, setCount] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    getActiveVehicleCountReport()
      .then((res) => {
        setCount(Number(res.data.active_vehicle_count));
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='flex min-w-[180px] flex-col items-center rounded-xl bg-white p-6 shadow dark:bg-neutral-900'>
      <div className='mb-1 text-xs text-gray-400 dark:text-gray-200'>
        Aktif Araç
      </div>
      {loading ? (
        <div className='text-lg font-bold text-gray-500'>Yükleniyor...</div>
      ) : error ? (
        <div className='text-sm text-red-600'>{error}</div>
      ) : (
        <div className='text-primary text-3xl font-bold'>{count}</div>
      )}
    </div>
  );
}
