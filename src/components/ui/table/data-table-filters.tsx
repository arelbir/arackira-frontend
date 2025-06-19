'use client';

import type { Column, Table } from '@tanstack/react-table';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import { DataTableToolbarFilter } from './data-table-filter'; // Bu dosyayı bir sonraki adımda oluşturacağız
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  filterVariants?: Array<{
    id: string;
    title: string;
    variant: string;
  }>;
}

/**
 * Gelişmiş filtreler için dialog bileşeni
 */
function AdvancedFilterDialog<TData>({ advancedFilters }: { advancedFilters: Column<TData, unknown>[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className='ml-2 px-3 py-1 rounded border text-xs bg-muted hover:bg-accent transition-colors'
          type='button'
        >
          Gelişmiş Filtreler
        </button>
      </SheetTrigger>
      <SheetContent side='right' className='max-w-4xl w-full'>
        {/* Erişilebilirlik için DialogTitle ekleniyor */}
        <h2 className="sr-only" id="advanced-filter-dialog-title">Tüm Filtreler</h2>
        <div className='px-6 pt-6 pb-4'>
          <div className='font-semibold text-lg mb-3'>Tüm Filtreler</div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3'>
            {advancedFilters.map((column) => 
              column ? (
                <DataTableToolbarFilter key={String(column.id)} column={column} />
              ) : null
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Tablo filtrelerini yöneten bileşen
 */
export function DataTableFilters<TData>({ table, filterVariants = [] }: DataTableFiltersProps<TData>) {
  const allColumns = React.useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table]);
  
  // Özel filtreler tanımlanmışsa, bunları kullan
  const filteredColumns = React.useMemo((): Column<TData, unknown>[] => {
    if (filterVariants.length) {
      // getColumn undefined dönebilir, filter(Boolean) ile undefined'ları filtreliyoruz
      return filterVariants.map(({ id }) => table.getColumn(id))
        .filter((col): col is Column<TData, unknown> => col !== undefined);
    }
    return allColumns;
  }, [table, filterVariants, allColumns]);
  
  // Core filtreler: enableColumnFilter true olanlar (veya filterVariants yoksa tüm kolonlar)
  const coreFilters = filteredColumns.filter(col => 
    col && (col.columnDef as any).enableColumnFilter === true
  );
  // Advanced filtreler: enableColumnFilter !== true olanlar
  const advancedFilters = filteredColumns.filter(col => 
    col && !(col.columnDef as any).enableColumnFilter
  );
  
  const isFiltered = table.getState().columnFilters.length > 0;
  
  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div className='w-full rounded-xl border bg-card shadow-sm dark:bg-card/80 px-2 py-1 transition-colors'>
      <div className='flex items-center gap-2'>
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-1'>
          {coreFilters.map((column) => 
            column ? (
              <DataTableToolbarFilter key={String(column.id)} column={column} />
            ) : null
          )}
        </div>
        <div className='mx-2 h-8 w-px bg-border' />
        <AdvancedFilterDialog advancedFilters={advancedFilters} />
      </div>
      {isFiltered && (
        <div className='flex justify-end mt-2'>
          <Button
            aria-label='Filtreleri sıfırla'
            variant='outline'
            size='sm'
            className='border-dashed'
            onClick={onReset}
          >
            <Cross2Icon />
            Sıfırla
          </Button>
        </div>
      )}
    </div>
  );
}
