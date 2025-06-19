'use client';

import type { Table } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableViewOptions } from './data-table-view-options';
import { cn } from '@/lib/utils';
import { RadixToolbar, RadixToolbarButton, RadixToolbarSeparator } from './radix-toolbar';

interface DataTableMainToolbarProps<TData> {
  table: Table<TData>;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Temel toolbar işlevselliğini sağlayan bileşen (görünüm ayarları vb.)
 */
export function DataTableMainToolbar<TData>({
  table,
  children,
  className,
}: DataTableMainToolbarProps<TData>) {
  return (
    <RadixToolbar className={cn("justify-end mb-3", className)}>
      {children}
      <RadixToolbarSeparator />
      <RadixToolbarButton asChild>
        <DataTableViewOptions table={table} />
      </RadixToolbarButton>
    </RadixToolbar>
  );
}
