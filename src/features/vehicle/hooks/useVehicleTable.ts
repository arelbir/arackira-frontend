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
import { formatDateTR, safeAccess } from '@/lib/utils';

export type StrictVehicle = Vehicle & {
  brand?: { name: string } | null;
  model?: { name: string } | null;
  color?: { name: string } | null;
  status?: { name: string } | null;
  fuel_type?: { name: string } | null;
  transmission?: { name: string } | null;
  vehicle_type?: { name: string } | null;
};

interface UseVehicleTableResult {
  table: ReturnType<typeof useReactTable<Vehicle>>;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (v: ColumnFiltersState) => void;
}

export const useVehicleTable = (vehicles: StrictVehicle[]): UseVehicleTableResult => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<StrictVehicle, any>[]>(
    () => [
      { accessorKey: 'id', header: 'ID', meta: { label: 'ID', variant: 'text' }, enableColumnFilter: false },
      { accessorKey: 'plate_number', header: 'Plaka', meta: { label: 'Plaka', variant: 'text', placeholder: 'Plaka' }, enableColumnFilter: true },
      { accessorKey: 'chassis_number', header: 'Şasi No', meta: { label: 'Şasi No', variant: 'text' }, enableColumnFilter: true },
      { header: 'Marka Adı', accessorFn: row => row.brand?.name || '-', meta: { label: 'Marka Adı', variant: 'text' }, enableColumnFilter: true },
      { header: 'Model Adı', accessorFn: row => row.model?.name || '-', meta: { label: 'Model Adı', variant: 'text' }, enableColumnFilter: true },
      { header: 'Renk Adı', accessorFn: row => row.color?.name || '-', meta: { label: 'Renk Adı', variant: 'text' }, enableColumnFilter: true },
      { accessorKey: 'model_year', header: 'Yıl', meta: { label: 'Yıl', variant: 'number' }, enableColumnFilter: true, cell: ({ row }) => safeAccess(row.original, ['model_year'], '-') },
      { accessorKey: 'vehicle_km', header: 'KM', meta: { label: 'KM', variant: 'number' }, enableColumnFilter: true, cell: ({ row }) => safeAccess(row.original, ['vehicle_km'], '-') },
      { accessorKey: 'branch_id', header: 'Ruhsat Sahibi Firma', meta: { label: 'Ruhsat Sahibi Firma', variant: 'number' }, cell: ({ row }) => safeAccess(row.original, ['branch_id'], '-') },
      { accessorKey: 'brand_id', header: 'Marka', meta: { label: 'Marka', variant: 'number' }, cell: ({ row }) => safeAccess(row.original, ['brand_id'], '-') },
      { accessorKey: 'model_id', header: 'Model', meta: { label: 'Model', variant: 'number' }, cell: ({ row }) => safeAccess(row.original, ['model_id'], '-') },
      { header: 'Marka', accessorFn: row => safeAccess(row, ['brand', 'name'], '-'), meta: { label: 'Marka', variant: 'text' } },
      { header: 'Model', accessorFn: row => safeAccess(row, ['model', 'name'], '-'), meta: { label: 'Model', variant: 'text' } },
      { header: 'Renk', accessorFn: row => safeAccess(row, ['color', 'name'], '-'), meta: { label: 'Renk', variant: 'text' } },
      { header: 'Durum', accessorFn: row => safeAccess(row, ['status', 'name'], '-'), meta: { label: 'Durum', variant: 'text' } },
      { accessorKey: 'vehicle_status_id', header: 'Durum', meta: { label: 'Durum', variant: 'number' }, cell: ({ row }) => safeAccess(row.original, ['vehicle_status_id'], '-') },
      { accessorKey: 'color_id', header: 'Renk', meta: { label: 'Renk', variant: 'number' }, cell: ({ row }) => safeAccess(row.original, ['color_id'], '-') },
      { accessorKey: 'vehicle_type_id', header: 'Araç Tipi', meta: { label: 'Araç Tipi', variant: 'number' }, cell: ({ row }) => safeAccess(row.original, ['vehicle_type_id'], '-') },
      { header: 'Araç Tipi Adı', accessorFn: row => safeAccess(row, ['vehicle_type', 'name'], '-'), meta: { label: 'Araç Tipi Adı', variant: 'text' } },
      { accessorKey: 'fuel_type_id', header: 'Yakıt Tipi', meta: { label: 'Yakıt Tipi', variant: 'number' }, cell: ({ row }) => safeAccess(row.original, ['fuel_type_id'], '-') },
      { header: 'Yakıt Tipi Adı', accessorFn: row => safeAccess(row, ['fuel_type', 'name'], '-'), meta: { label: 'Yakıt Tipi Adı', variant: 'text' } },
      { accessorKey: 'engine_power_hp', header: 'Motor Gücü (HP)', meta: { label: 'Motor Gücü', variant: 'number', unit: 'hp' }, cell: ({ row }) => safeAccess(row.original, ['engine_power_hp'], '-') },
      { accessorKey: 'engine_volume_cc', header: 'Motor Hacmi (cc)', meta: { label: 'Motor Hacmi', variant: 'number', unit: 'cc' }, cell: ({ row }) => safeAccess(row.original, ['engine_volume_cc'], '-') },
      { accessorKey: 'engine_number', header: 'Motor No', meta: { label: 'Motor No', variant: 'text' }, cell: ({ getValue, row }) => safeAccess(row.original, ['engine_number'], '-') },
      { accessorKey: 'first_registration_date', header: 'İlk Tescil', meta: { label: 'İlk Tescil', variant: 'date' }, cell: ({ getValue }) => formatDateTR(getValue()) },
      { accessorKey: 'registration_document_number', header: 'Ruhsat No', meta: { label: 'Ruhsat No', variant: 'text' }, cell: ({ getValue, row }) => safeAccess(row.original, ['registration_document_number'], '-') },
      { accessorKey: 'package', header: 'Paket', meta: { label: 'Paket', variant: 'text' }, cell: ({ getValue, row }) => safeAccess(row.original, ['package'], '-') },
      { accessorKey: 'version', header: 'Versiyon', meta: { label: 'Versiyon', variant: 'text' }, cell: ({ getValue, row }) => safeAccess(row.original, ['version'], '-') },
      { accessorKey: 'vehicle_group_id', header: 'Araç Grubu', meta: { label: 'Araç Grubu', variant: 'number' }, cell: ({ getValue, row }) => safeAccess(row.original, ['vehicle_group_id'], '-') },
      { accessorKey: 'body_type', header: 'Kasa Tipi', meta: { label: 'Kasa Tipi', variant: 'text' }, cell: ({ getValue, row }) => safeAccess(row.original, ['body_type'], '-') },
      { accessorKey: 'transmission_id', header: 'Vites Tipi', meta: { label: 'Vites Tipi', variant: 'number' }, cell: ({ getValue, row }) => safeAccess(row.original, ['transmission_id'], '-') },
      { header: 'Vites Tipi Adı', accessorFn: row => safeAccess(row, ['transmission', 'name'], '-'), meta: { label: 'Vites Tipi Adı', variant: 'text' } },
      { accessorKey: 'next_maintenance_date', header: 'Bakım Tarihi', meta: { label: 'Bakım Tarihi', variant: 'date' }, cell: ({ getValue, row }) => formatDateTR(safeAccess(row.original, ['next_maintenance_date'], null)) },
      { accessorKey: 'inspection_expiry_date', header: 'Muayene Bitiş', meta: { label: 'Muayene Bitiş', variant: 'date' }, cell: ({ getValue, row }) => formatDateTR(safeAccess(row.original, ['inspection_expiry_date'], null)) },
      { accessorKey: 'insurance_expiry_date', header: 'Trafik Sig. Bitiş', meta: { label: 'Trafik Sig. Bitiş', variant: 'date' }, cell: ({ getValue, row }) => formatDateTR(safeAccess(row.original, ['insurance_expiry_date'], null)) },
      { accessorKey: 'casco_expiry_date', header: 'Kasko Bitiş', meta: { label: 'Kasko Bitiş', variant: 'date' }, cell: ({ getValue, row }) => formatDateTR(safeAccess(row.original, ['casco_expiry_date'], null)) },
      { accessorKey: 'exhaust_stamp_expiry_date', header: 'Egzoz Pul Bitiş', meta: { label: 'Egzoz Pul Bitiş', variant: 'date' }, cell: ({ getValue, row }) => formatDateTR(safeAccess(row.original, ['exhaust_stamp_expiry_date'], null)) },
      { accessorKey: 'tsb_code', header: 'TSB Kodu', meta: { label: 'TSB Kodu', variant: 'text' }, cell: ({ row }) => safeAccess(row.original, ['tsb_code'], '-') },
      { accessorKey: 'is_draft', header: 'Taslak', meta: { label: 'Taslak', variant: 'boolean' }, cell: ({ row }) => safeAccess(row.original, ['is_draft'], '-') },
    ],
    []
  );

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
      const chassis = typeof row.original.chassis_number === 'string' ? row.original.chassis_number : '';
      return chassis.toLowerCase().includes(v);
    },
    enableGlobalFilter: true
  });

  return { table, globalFilter, setGlobalFilter, columnFilters, setColumnFilters };
};
