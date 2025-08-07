'use client';

import React, { useMemo, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type TableMeta,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { Contract } from '../types';

interface CustomTableMeta<TData> extends TableMeta<TData> {
  mutate?: () => void;
}

export const useContractTable = (
  contracts: Contract[], 
  mutate?: () => void
) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<Contract>[]>(() => [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'contract_number',
      header: 'Sözleşme No',
      meta: {
        showFilter: true,
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    { accessorKey: 'client_id', header: 'Müşteri ID' },
    { accessorKey: 'vehicle_id', header: 'Araç ID' },
    { accessorKey: 'start_date', header: 'Başlangıç Tarihi' },
    { accessorKey: 'end_date', header: 'Bitiş Tarihi' },
    {
      accessorKey: 'status',
      header: 'Durum',
      meta: {
        showFilter: true,
        variant: 'select',
        options: [
          { label: 'Aktif', value: 'active' },
          { label: 'Süresi Dolmuş', value: 'expired' },
          { label: 'Feshedilmiş', value: 'terminated' },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      header: 'İşlemler',
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
  ], []);

  const table = useReactTable({
    data: contracts,
    columns,
    state: { 
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      mutate,
    } as CustomTableMeta<Contract>,
  });

  return { table };
};