'use client';

import type { Table } from '@tanstack/react-table';
import * as React from 'react';

import { cn } from '@/lib/utils';

// Modüler bileşen importları
import { DataTableMainToolbar } from './data-table-main-toolbar';
import { DataTableBulkActionsSlideIn } from './data-table-bulk-actions-slide-in';
import { DataTableFilters } from './data-table-filters';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  resourceUrl?: string; // API endpoint ör: "/api/clients"
  onAction?: () => void; // İşlem sonrası çağrılacak callback (ör: SWR mutate)
  editBasePath?: string; // Düzenleme sayfası base path'i, ör: "/dashboard/clients"
}

/**
 * DRY uyumlu yeniden tasarlanmış DataTableToolbar bileşeni
 * 
 * Özellikler:
 * 1. Tüm işlem mantığını separate modüllere (hooks, bileşenler) taşındı
 * 2. Görünüm ve mantık ayrıldı (separation of concerns)
 * 3. Modüler alt bileşenler (filters, actions, toolbar) oluşturuldu
 * 4. TypeScript tip güvenliği güçlendirildi
 */
export function DataTableToolbar<TData>({
  table,
  children,
  className,
  resourceUrl,
  onAction,
  editBasePath,
  ...props
}: DataTableToolbarProps<TData>) {
  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {/* Bulk actions slide-in toolbar */}
      <DataTableBulkActionsSlideIn 
        table={table}
        resourceUrl={resourceUrl}
        onAction={onAction}
        editBasePath={editBasePath}
      />
      
      {/* Main toolbar */}
      <DataTableMainToolbar table={table}>
        {children}
      </DataTableMainToolbar>
      
      {/* Filters */}
      <DataTableFilters table={table} />
    </div>
  );
}

/**
 * Dokümantasyon
 *
 * DataTableToolbar artık şu modüler bileşenlerden oluşur:
 * 
 * 1. DataTableMainToolbar: Temel toolbar işlevselliğini (görünüm ayarları vb.) içerir
 * 2. DataTableBulkActionsSlideIn: Seçili satırlar için slide-in aksiyonlar çubuğu
 * 3. DataTableFilters: Filtre sistemi
 * 4. ActionButton: Yeniden kullanılabilir ortak buton şablonu
 * 
 * Hepsi DRY prensibine uygun şekilde tasarlanmıştır
 */
