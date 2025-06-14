import { useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Vehicle } from '../types';

interface UseVehicleTableResult {
  table: ReturnType<typeof useReactTable<Vehicle>>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (v: ColumnFiltersState) => void;
}

export const useVehicleTable = (vehicles: Vehicle[]): UseVehicleTableResult => {
  /* ---------------- state ---------------- */
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  /* ---------------- columns ---------------- */
  const columns = useMemo<ColumnDef<Vehicle, any>[]>(
    () => [
      {
        accessorKey: 'plate_number',
        header: 'Plaka',
        meta: { label: 'Plaka', variant: 'text', placeholder: 'Plaka' }
      },
      {
        accessorKey: 'brand_id',
        header: 'Marka',
        meta: { label: 'Marka ID', variant: 'number' }
      },
      {
        accessorKey: 'model_id',
        header: 'Model',
        meta: { label: 'Model ID', variant: 'number' }
      },
      {
        accessorKey: 'vehicle_status_id',
        header: 'Durum',
        meta: { label: 'Durum ID', variant: 'number' }
      },
      {
        accessorKey: 'model_year',
        header: 'Yıl',
        meta: { label: 'Yıl', variant: 'number' }
      },
      {
        accessorKey: 'vehicle_km',
        header: 'Km',
        meta: { label: 'Km', variant: 'number', unit: 'km' }
      }
    ],
    []
  );

  /* ---------------- table ---------------- */
  const table = useReactTable({
    data: vehicles,
    columns,
    state: { globalFilter, columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _colId, value) => {
      const v = (value as string).toLowerCase();
      return row.original.plate_number.toLowerCase().includes(v);
    },
    enableGlobalFilter: true
  });

  return { table, globalFilter, setGlobalFilter, columnFilters, setColumnFilters };
};
