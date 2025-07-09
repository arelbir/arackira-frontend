'use client';
import React from 'react';
import { getRentalCountByClientReport } from './reportsService';

export default function RentalCountByClientWidget() {
  const [clients, setClients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    getRentalCountByClientReport()
      .then((res) => {
        setClients(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='min-w-[320px] rounded-xl bg-white p-6 shadow dark:bg-neutral-900'>
      <div className='mb-2 text-xs text-gray-400 dark:text-gray-200'>
        Müşteri Bazında Kiralama
      </div>
      {loading ? (
        <div className='text-gray-500'>Yükleniyor...</div>
      ) : error ? (
        <div className='text-sm text-red-600'>{error}</div>
      ) : clients.length === 0 ? (
        <div className='text-sm text-gray-500'>Kayıt yok</div>
      ) : (
        <table className='min-w-full bg-white text-xs dark:bg-neutral-900'>
          <thead>
            <tr className='text-muted-foreground border-b text-left dark:border-gray-700 dark:text-gray-300'>
              <th className='px-2 py-1'>Müşteri</th>
              <th className='px-2 py-1'>Toplam Kiralama</th>
            </tr>
          </thead>
          <tbody>
            {clients.slice(0, 5).map((c) => (
              <tr
                key={c.client_company_id}
                className='border-b last:border-0 dark:border-gray-700'
              >
                <td className='px-2 py-1'>{c.client_company_name}</td>
                <td className='px-2 py-1'>{c.total_rentals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
