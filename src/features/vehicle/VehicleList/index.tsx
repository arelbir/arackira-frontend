'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { VehicleImportExport } from './VehicleImportExport';
import { useVehicleTable } from '../hooks/useVehicleTable';
import { useVehicles } from '../hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';


const VehicleList: React.FC = () => {
  const { vehicles, loading, error } = useVehicles();
  const { table } = useVehicleTable(vehicles);
  const router = useRouter();



  /* ---------------- render ---------------- */
  if (error) return <div className='p-8 text-red-500'>Error: {error instanceof Error ? error.message : String(error)}</div>;

  return (
    <div className='flex h-full w-full flex-col p-8'>
      <DataTableToolbar table={table} className="mb-3" storageKey="vehicles-table">
      <VehicleImportExportModal />
        <Button size="sm" onClick={() => router.push('/dashboard/vehicles/create')} className="mr-4">
            Araç Ekle
          </Button>                 
      </DataTableToolbar>
      <div className='flex-1 min-h-0 flex flex-col overflow-auto mb-4'>
        {loading ? (
          <DataTableSkeleton columnCount={table.getAllColumns().length} rowCount={10} />
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
};


function VehicleImportExportModal() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="mr-2" onClick={() => setOpen(true)}>
          Toplu Araç Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Araçları Toplu İçe Aktar / Dışa Aktar</DialogTitle>
        <VehicleImportExport />
      </DialogContent>
    </Dialog>
  );
}

export default VehicleList;