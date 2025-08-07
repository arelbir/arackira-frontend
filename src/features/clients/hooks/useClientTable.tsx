'use client';

import React, { useMemo, useState, useRef, MouseEvent } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  TableMeta,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  useReactTable,
  Table,
  ExpandedState,
} from '@tanstack/react-table';
import { createUrlActionsColumn } from '@/components/ui/table/table-helpers';
import { handleRowSelectionWithKeys } from "@/components/ui/table/data-table-row-selection";

import { useAllClientTypes } from '@/features/definitions/client-types/use-client-types';
import { useClients } from './useClients';
import { ClientCompany, ClientCompanyWithSubRows } from '../types';

// Extend the TanStack TableMeta interface to include our mutate function
interface CustomTableMeta<TData> extends TableMeta<TData> {
  mutate?: () => void;
  deleteMutation?: (id: number) => void;
  showFilter?: boolean;
  filterVariant?: 'select' | 'text';
  filterOptions?: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[];
}

interface UseClientTableResult {
  table: Table<ClientCompanyWithSubRows>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (v: ColumnFiltersState) => void;
}

export const useClientTable = (
  clients: ClientCompanyWithSubRows[],
  mutate?: () => void
): UseClientTableResult => {
  const { data: clientTypes, isLoading: isClientTypesLoading } = useAllClientTypes();
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  
  // Define columns with hierarchical support
  const columns = useMemo<ColumnDef<ClientCompanyWithSubRows>[]>(() => [
    { 
      accessorKey: 'id', 
      header: 'ID',
      meta: {
        label: 'ID'
      }
    },
    {
      accessorKey: 'company_name',
      header: 'Şirket Adı',
      cell: ({ row, getValue }) => {
        const canExpand = row.getCanExpand();
        const isExpanded = row.getIsExpanded();
        const depth = row.depth;
        
        return (
          <div style={{ paddingLeft: `${depth * 1.5}rem` }} className="flex items-center">
            {canExpand ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            ) : (
              <span className="mr-2 w-8"></span>
            )}
            {getValue<string>()}
          </div>
        );
      },
      meta: {
        label: 'Şirket Adı',
        showFilter: true,
        variant: 'text',
        colSpan: 2
      },
      enableColumnFilter: true
    },
    { 
      accessorKey: 'contact_person', 
      header: 'Yetkili',
      meta: {
        label: 'Yetkili',
        showFilter: true,
        variant: 'text',
        colSpan: 2
      },
      enableColumnFilter: true
    },
    { 
      accessorKey: 'email', 
      header: 'E-posta',
      meta: {
        label: 'E-posta',
        variant: 'text'
      }
    },
    { 
      accessorKey: 'phone', 
      header: 'Telefon',
      meta: {
        label: 'Telefon',
        variant: 'text'
      }
    },
    { 
      accessorKey: 'tax_id',
      header: 'Vergi No',
      meta: {
        label: 'Vergi No',
        variant: 'text'
      }
    },
    { 
      accessorKey: 'description',
      header: 'Açıklama',
      meta: {
        label: 'Açıklama',
        variant: 'text'
      }
    },
    {
      accessorKey: 'client_type_id',
      header: 'Tip',
      cell: ({ row }) => {
        const typeId = row.original.client_type_id;
        const type = clientTypes?.find(t => t.id === typeId);
        return type ? type.name : 'N/A';
      },
      meta: {
        label: 'Müşteri Tipi'
      }
    },
    {
      ...createUrlActionsColumn({
        viewUrlPrefix: '/dashboard/clients',
        editUrlPrefix: '/dashboard/clients',
      }),
      meta: {
        label: 'İşlemler'
      }
    }
  ], [clientTypes]);

  // Use React Table hook with proper typing
  const table = useReactTable<ClientCompanyWithSubRows>({
    data: clients,
    columns,
    state: { 
      globalFilter, 
      columnFilters,
      expanded,
      columnVisibility: {
        // Tüm sütunları görünür yap
        id: true,
        company_name: true,
        contact_person: true,
        email: true,
        phone: true,
        tax_id: true,
        description: true,
        client_type_id: true,
        actions: true
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetPageIndex: false,
    meta: {
      mutate,
    } as CustomTableMeta<ClientCompanyWithSubRows>,
  });

  // Debug logging removed - hierarchical table is now working correctly

  return {
    table,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
  };
};
