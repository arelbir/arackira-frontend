'use client';

import type { Column } from '@tanstack/react-table';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { DataTableDateFilter } from './data-table-date-filter';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableSliderFilter } from './data-table-slider-filter';

// Özel kolon meta tip tanımı
interface CustomColumnMeta<TData> {
  label?: string;
  placeholder?: string;
  variant?: 'text' | 'date' | 'faceted' | 'slider' | 'number' | 'range' | 'boolean' | 'select' | 'dateRange' | 'multiSelect';
  filterOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  unit?: string;
}

// TanStack Table için tip genişletmesi
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> extends CustomColumnMeta<TData> {}
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

/**
 * Tablo kolonları için filtre bileşeni
 * Kolon meta özelliğine göre uygun filtre tipini render eder
 */
export function DataTableToolbarFilter<TData>({
  column
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  // Meta özelliği yoksa filtre gösterme
  if (!columnMeta?.variant) return null;

  // Kolon tipine göre uygun filtre bileşenini göster
  switch (columnMeta.variant) {
    case 'text':
      return (
        <Input
          placeholder={columnMeta.placeholder ?? columnMeta.label}
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className='h-8 w-full'
        />
      );
    case 'date':
      return (
        <DataTableDateFilter column={column} title={columnMeta.label || column.columnDef.header?.toString() || ''} />
      );
    case 'faceted':
      if (!columnMeta.filterOptions) {
        return null;
      }
      return (
        <DataTableFacetedFilter
          column={column}
          title={columnMeta.label ?? ''}
          options={columnMeta.filterOptions}
        />
      );
    case 'slider':
      return (
        <DataTableSliderFilter column={column} />
      );
    default:
      return null;
  }
}
