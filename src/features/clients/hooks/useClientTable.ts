'use client';

import React, { useMemo, useState, useRef } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type TableMeta,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Checkbox } from "@/components/ui/checkbox";
import { handleRowSelectionWithKeys } from "@/components/ui/table/data-table-row-selection";
import { ClientCompany } from './useClients';

// Extend the TanStack TableMeta interface to include our mutate function
interface CustomTableMeta<TData> extends TableMeta<TData> {
  mutate?: () => void;
}

interface UseClientTableResult {
  table: ReturnType<typeof useReactTable<ClientCompany>>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (v: ColumnFiltersState) => void;
  rowSelection: RowSelectionState;
  setRowSelection: (state: RowSelectionState) => void;
  selectedRows: ClientCompany[];
}

export const useClientTable = (
  clients: ClientCompany[], 
  mutate?: () => void
): UseClientTableResult => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  
  // Klavye kısayolları için son seçilen index referansı
  const lastSelectedIndex = useRef<number | null>(null);
  
  // Tüm satır ID'lerini oluştur
  const allRowIds = useMemo(() => {
    return (clients || []).map((client) => String(client.id));
  }, [clients]);

  // Define columns once with correct TypeScript types
  const columns = useMemo<ColumnDef<ClientCompany>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => {
        return React.createElement(Checkbox, {
          checked: table.getIsAllPageRowsSelected(),
          onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
          "aria-label": "Tümünü seç",
        });
      },
      cell: ({ row }) => {
        // Shift+Click ve Ctrl+Click destekli seçim için handler
        const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
          handleRowSelectionWithKeys({
            rowSelection,
            setRowSelection,
            allRowIds,
            lastSelectedIndex
          })(e, row.id);
        };

        // Burada JSX yerine createElement kullanıyoruz çünkü bu bir .ts dosyası
        const checkboxElement = React.createElement(Checkbox, {
          checked: row.getIsSelected(),
          onCheckedChange: (value) => row.toggleSelected(!!value),
          "aria-label": "Satırı seç",
          onClick: (e: React.MouseEvent) => e.stopPropagation()
        });
        
        return React.createElement(
          'div',
          { className: 'cursor-pointer', onClick: handleRowClick },
          checkboxElement
        );
      },
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'company_name', header: 'Şirket Adı' },
    { accessorKey: 'contact_person', header: 'Yetkili' },
    { accessorKey: 'email', header: 'E-posta' },
    { accessorKey: 'phone', header: 'Telefon' },
    { accessorKey: 'client_type_id', header: 'Tip' },
    { accessorKey: 'parent_company_id', header: 'Ana Şirket' },
    // İşlemler sütunu kaldırıldı
  ], []);

  // Use React Table hook with proper typing
  const table = useReactTable({
    data: clients,
    columns,
    state: { 
      globalFilter, 
      columnFilters,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      mutate, // Pass through the mutate function from props
    } as CustomTableMeta<ClientCompany>,
  });

  // Get all selected rows data
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);

  return {
    table,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    selectedRows,
  };
};

