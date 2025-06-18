"use client";

import React from 'react';
import { useClients } from '../hooks/useClients';
import { useClientTable } from '../hooks/useClientTable';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ClientList: React.FC = () => {
  const { clients, isLoading, isError } = useClients();
  const { table } = useClientTable(clients);
  const router = useRouter();
  // Debug logs
  console.log('[ClientList] clients:', clients);
  console.log('[ClientList] isLoading:', isLoading);
  console.log('[ClientList] table.getRowModel().rows:', table.getRowModel().rows);

  if (isError) return <div className='p-8 text-red-500'>Hata: Veri alınamadı.</div>;

  return (
    <div className='flex h-full w-full flex-col p-8'>
      <DataTableToolbar table={table} className="mb-3">
        <Button size="sm" onClick={() => router.push('/clients/new')} className="mr-4">
          Müşteri Ekle
        </Button>
      </DataTableToolbar>
      <div className='flex-1 min-h-0 flex flex-col overflow-auto mb-4'>
        {isLoading ? (
          <DataTableSkeleton columnCount={table.getAllColumns().length} rowCount={10} />
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
};

export default ClientList;
