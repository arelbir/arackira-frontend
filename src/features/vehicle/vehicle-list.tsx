// Araçları listeleyen temel component (iskele)
'use client';

import React, { useState } from 'react';
import { useBrand, useModel, useColor } from '@/features/definitions/hooks';
import { Switch } from '@/components/ui/switch';
import { MoreVertical } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import VehicleDetailModal from './VehicleDetailModal';
import VehicleActionsMenu from './vehicle-actions-menu';
import { useVehicle } from '@/features/vehicle/hooks/useVehicle';

interface VehicleListProps {
  // Add props type definition here if needed
}

const VehicleList: React.FC<VehicleListProps> = () => {
  const { vehicles, loading, error } = useVehicle();
  const { brands } = useBrand();
  const { models } = useModel();
  const { colors } = useColor();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'maintenance' | 'rented' | 'disposed'>('all');
  const [detailVehicle, setDetailVehicle] = useState<any | null>(null);

  const activeCount = vehicles.filter((v: any) => v.current_status === 'active').length;
  const maintenanceCount = vehicles.filter((v: any) => v.current_status === 'maintenance').length;
  const rentedCount = vehicles.filter((v: any) => v.current_status === 'rented').length;
  const disposedCount = vehicles.filter((v: any) => v.current_status === 'disposed').length;

  const filteredVehicles = vehicles.filter((v: any) => {
    if (filter !== 'all' && v.current_status !== filter) return false;
    if (
      search &&
      !(
        v.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
        v.brand_id?.toString().includes(search) ||
        v.model_id?.toString().includes(search) ||
        v.branch_id?.toString().includes(search)
      )
    )
      return false;
    return true;
  });

  // Tam sayfa yönlendirme için navigate fonksiyonu (React Router veya Next.js)
  function handleAdd() {
    window.location.href = '/dashboard/vehicles/create';
    // Eğer React Router kullanıyorsanız:
    // navigate('/vehicles/create');
  }
  function handleEdit(vehicle: any) {
    window.location.href = `/dashboard/vehicles/edit/${vehicle.id}`;
    // Eğer React Router kullanıyorsanız:
    // navigate(`/vehicles/edit/${vehicle.id}`);
  }

  return (
    <ProtectedRoute>
      <div className='bg-background m-0 flex min-h-screen w-full flex-col p-0'>
        <div className='flex flex-wrap items-center gap-6 px-8 pt-8 pb-4'>
          <h1 className='flex-1 text-2xl font-bold'>Araç Yönetimi</h1>
          <div className='text-foreground font-semibold'>
            Toplam: <span className='text-primary'>{vehicles.length}</span>
          </div>
          <div className='text-foreground font-semibold'>
            Aktif:{' '}
            <span className='text-green-600 dark:text-green-400'>
              {activeCount}
            </span>
          </div>
          <div className='text-foreground font-semibold'>
            Bakımda:{' '}
            <span className='text-yellow-600 dark:text-yellow-400'>
              {maintenanceCount}
            </span>
          </div>
          <div className='text-foreground font-semibold'>
            Kirada:{' '}
            <span className='text-blue-600 dark:text-blue-400'>
              {rentedCount}
            </span>
          </div>
          <div className='text-foreground font-semibold'>
            Hurda:{' '}
            <span className='text-muted-foreground'>{disposedCount}</span>
          </div>
          <button
            onClick={handleAdd}
            className='bg-primary hover:bg-primary/90 ml-auto rounded px-5 py-2 font-semibold text-white'
          >
            Yeni Araç Ekle
          </button>
        </div>
        <div className='flex items-center gap-4 px-8 pb-4'>
          <input
            type='text'
            placeholder='Plaka, marka, model ara...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='bg-muted text-foreground border-border focus:ring-primary w-full max-w-xs rounded border px-4 py-2 focus:ring-2 focus:outline-none'
          />
          <div className='flex gap-2'>
            <button
              className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'all' ? 'text-primary' : 'text-foreground'} hover:bg-muted/70`}
              onClick={() => setFilter('all')}
            >
              Tümü
            </button>
            <button
              className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'active' ? 'text-green-600' : 'text-foreground'} hover:bg-muted/70`}
              onClick={() => setFilter('active')}
            >
              Aktif
            </button>
            <button
              className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'maintenance' ? 'text-yellow-600' : 'text-foreground'} hover:bg-muted/70`}
              onClick={() => setFilter('maintenance')}
            >
              Bakımda
            </button>
            <button
              className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'rented' ? 'text-blue-600' : 'text-foreground'} hover:bg-muted/70`}
              onClick={() => setFilter('rented')}
            >
              Kirada
            </button>
            <button
              className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'disposed' ? 'text-muted-foreground' : 'text-foreground'} hover:bg-muted/70`}
              onClick={() => setFilter('disposed')}
            >
              Hurda
            </button>
          </div>
        </div>
        {loading ? (
          <div className='flex flex-col gap-2 p-8'>
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className='bg-muted h-12 animate-pulse rounded'
              />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className='text-muted-foreground p-8 text-center'>
            Hiç araç yok.
            <br />
            <span className='text-sm'>
              Yeni araç eklemek için yukarıdaki butonu kullanabilirsiniz.
            </span>
          </div>
        ) : (
          <div className='w-full flex-1 overflow-x-auto'>
            <table className='text-foreground w-full max-w-none min-w-[1200px] border-separate border-spacing-0'>
              <thead className='bg-muted sticky top-0 z-10'>
                <tr>
                  <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                    Durum
                  </th>
                  <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                    Plaka
                  </th>
                  <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                    Marka
                  </th>
                  <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                    Model
                  </th>
                  <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                    Yıl
                  </th>
                  <th className='text-muted-foreground px-6 py-4 text-right text-xs font-bold tracking-wider'>
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((v: any) => (
                  <tr key={v.id}>
                    <td className='px-6 py-4 text-left text-sm'>
                      {v.current_status}
                    </td>
                    <td className='px-6 py-4 text-left text-sm'>
                      {v.plate_number}
                    </td>
                    <td className='px-6 py-4 text-left text-sm'>{brands.find((b: {id: number, name: string}) => b.id === v.brand_id)?.name || v.brand_id}</td>
                    <td className='px-6 py-4 text-left text-sm'>{models.find((m: {id: number, name: string}) => m.id === v.model_id)?.name || v.model_id}</td>
                    <td className='px-6 py-4 text-left text-sm'>{v.branch_id}</td>
                    <td className='px-6 py-4 text-left text-sm'>{colors.find((c: {id: number, name: string}) => c.id === v.color_id)?.name || v.color_id}</td>
                    <td className='px-6 py-4 text-right text-sm'>
                      <VehicleActionsMenu
                        vehicle={v}
                        onEdit={() => window.location.href = `/vehicles/edit/${v.id}`}
                        onDelete={undefined}
                        onDetail={setDetailVehicle}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <VehicleDetailModal
          vehicle={detailVehicle}
          onClose={() => setDetailVehicle(null)}
        />
      </div>
    </ProtectedRoute>
  );
};

export default VehicleList;
