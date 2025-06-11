import { useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { Vehicle } from '../vehicleService';
import { getVehicleColumns } from './vehicle-columns';

export interface UseVehicleTableParams {
  vehicles: Vehicle[];
  onDetail: (v: Vehicle) => void;
  onEdit: (v: Vehicle) => void;
  onDelete: (v: Vehicle) => void;
  getBrandName: (id?: number | null) => string;
  getModelName: (id?: number | null) => string;
  getBranchName: (id?: number | null) => string;
  getColorName: (id?: number | null) => string;
  getStatusName: (id?: number | null) => string;
  loadingId?: number | null;
  debouncedSearch?: string;
  statusFilter?: 'all' | number;
  initialPageSize?: number;
}

export function useVehicleTable({
  vehicles,
  onDetail,
  onEdit,
  onDelete,
  getBrandName,
  getModelName,
  getBranchName,
  getColorName,
  getStatusName,
  loadingId = null,
  debouncedSearch = '',
  statusFilter = 'all',
  initialPageSize = 10,
}: UseVehicleTableParams) {
  console.log('useVehicleTable called', { vehicles, debouncedSearch, statusFilter });
  // Memoize columns and globalFilterFn to prevent infinite loop
  const columns = useMemo(() => {
    const cols = getVehicleColumns({
      onDetail,
      onEdit,
      onDelete,
      getBrandName,
      getModelName,
      getBranchName,
      getColorName,
      getStatusName,
      loadingId: loadingId ?? null,
    });
    return cols;
  }, [onDetail, onEdit, onDelete, getBrandName, getModelName, getBranchName, getColorName, getStatusName, loadingId]);

  const globalFilterFn = useCallback((row: any, columnId: string, filterValue: any) => {
    const { plate_number, brand_id, model_id, branch_id, color_id } = row.original;
    const q = (filterValue || '').toString().toLowerCase();
    return (
      (plate_number?.toLowerCase().includes(q) ||
        getBrandName(brand_id).toLowerCase().includes(q) ||
        getModelName(model_id).toLowerCase().includes(q) ||
        getBranchName(branch_id).toLowerCase().includes(q) ||
        getColorName(color_id).toLowerCase().includes(q))
    );
  }, [getBrandName, getModelName, getBranchName, getColorName]);

  const tableInstance = useReactTable({
    data: vehicles,
    columns,
    state: {
      globalFilter: debouncedSearch,
      columnFilters: [
        statusFilter !== 'all'
          ? { id: 'vehicle_status_id', value: [statusFilter] }
          : undefined,
      ].filter(Boolean) as any,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: initialPageSize },
    },
    globalFilterFn,
    enableGlobalFilter: true,
  });

  return tableInstance;
}
