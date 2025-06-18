'use client';
import { useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ClientCompany } from './useClients';

interface UseClientTableResult {
  table: ReturnType<typeof useReactTable<ClientCompany>>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (v: ColumnFiltersState) => void;
}

export const useClientTable = (clients: ClientCompany[]): UseClientTableResult => {
  console.log('[useClientTable] clients:', clients);

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Kolonlar statik, doğrudan tanımla
  const columns: ColumnDef<ClientCompany, any>[] = [
    { accessorKey: 'id', header: 'ID', enableColumnFilter: false },
    { accessorKey: 'company_name', header: 'Şirket Adı', enableColumnFilter: true },
    { accessorKey: 'contact_person', header: 'Yetkili', enableColumnFilter: true },
    { accessorKey: 'email', header: 'E-posta', enableColumnFilter: true },
    { accessorKey: 'phone', header: 'Telefon', enableColumnFilter: true },
    { accessorKey: 'client_type_id', header: 'Tip', enableColumnFilter: true },
    { accessorKey: 'parent_company_id', header: 'Ana Şirket', enableColumnFilter: true },
  ];
  console.log('[useClientTable] clients:', clients);
  console.log('[useClientTable] columns:', columns);

  // clients array'i değiştikçe table instance'ı güncellenir
  const table = useReactTable({
    data: clients,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
  };

};
