'use client';

import React from 'react';

import { Input } from '@/components/ui/input';

import { useVehicleTable } from '../hooks/useVehicleTable';
import { useVehicles } from '../hooks/useVehicles';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';


const VehicleList: React.FC = () => {
  const { vehicles, loading, error } = useVehicles();
  const { table, globalFilter, setGlobalFilter } = useVehicleTable(vehicles);



  /* ---------------- render ---------------- */
  if (error) return <div className='p-8 text-red-500'>Error: {error}</div>;

  return (
    <div className='flex h-full w-full flex-col p-8'>
      <DataTableToolbar table={table}>
        <Input
          placeholder='Plaka ara...' aria-label='Plaka ara'
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className='h-8 w-48 lg:w-64'
        />
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
