'use client';

import React from 'react';


import { useVehicleTable } from '../hooks/useVehicleTable';
import { useVehicles } from '../hooks/useVehicles';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';


const VehicleList: React.FC = () => {
  const { vehicles, loading, error } = useVehicles();
  const { table } = useVehicleTable(vehicles);
  const router = useRouter();



  /* ---------------- render ---------------- */
  if (error) return <div className='p-8 text-red-500'>Error: {error}</div>;

  return (
    <div className='flex h-full w-full flex-col p-8'>
      <DataTableToolbar table={table}>
        <Button size="sm" onClick={() => router.push('/dashboard/vehicles/create')} className="mr-4">
            Araç Ekle
          </Button>
      </DataTableToolbar>

      <div className='flex-1 min-h-0 flex flex-col overflow-auto'>
        {loading ? (
          <DataTableSkeleton columnCount={table.getAllColumns().length} rowCount={10} />
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
};

export default VehicleList;
