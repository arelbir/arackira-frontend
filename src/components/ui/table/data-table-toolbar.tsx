'use client';

import type { Column, Table } from '@tanstack/react-table';
import * as React from 'react';

import { DataTableDateFilter } from '@/components/ui/table/data-table-date-filter';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { DataTableSliderFilter } from '@/components/ui/table/data-table-slider-filter';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';


interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { RadixToolbar, RadixToolbarButton, RadixToolbarSeparator } from './radix-toolbar';

function AdvancedFilterDialog({ advancedFilters }: { advancedFilters: any[] }) {
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
        {/* Radix Dialog erişilebilirlik gereği başlık eklenmeli */}
        <span style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>
          <span id="advanced-filter-dialog-title">Gelişmiş Filtreler</span>
        </span>
        <div className='px-6 pt-6 pb-4'>
          <div className='font-semibold text-lg mb-3'>Gelişmiş Filtreler</div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3'>
            {advancedFilters.map((column) => (
              <DataTableToolbarFilter key={String(column.id)} column={column} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Kolonları core/advanced olarak ayır
  const allColumns = React.useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table]);
  // Core filtreler: enableColumnFilter true olanlar (veya meta'da core: true olanlar)
  const coreFilters = allColumns.filter(col => (col.columnDef as any).enableColumnFilter === true);
  // Advanced filtreler: enableColumnFilter !== true olanlar
  const advancedFilters = allColumns.filter(col => !(col.columnDef as any).enableColumnFilter);

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {/* Radix UI Toolbar - aksiyonlar */}
      <RadixToolbar className="justify-end mb-3">
        {children}
        <RadixToolbarSeparator />
        <RadixToolbarButton asChild>
          <DataTableViewOptions table={table} />
        </RadixToolbarButton>
      </RadixToolbar>
      {/* Filtreler kutusu */}
      <div className='w-full rounded-xl border bg-card shadow-sm dark:bg-card/80 px-2 py-1 transition-colors'>
        <div className='flex items-center gap-2'>
          <div className='flex-1 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-1'>
            {coreFilters.map((column) => (
              <DataTableToolbarFilter key={column.id} column={column} />
            ))}
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
    </div>
  );
}
interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column
}: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta;

    const onFilterRender = React.useCallback(() => {
      if (!columnMeta?.variant) return null;

      switch (columnMeta.variant) {
        case 'text':
          return (
            <Input
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ''}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className='h-8 w-40 lg:w-56'
            />
          );

        case 'number':
          return (
            <div className='relative'>
              <Input
                type='number'
                inputMode='numeric'
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className={cn('h-8 w-[120px]', columnMeta.unit && 'pr-8')}
              />
              {columnMeta.unit && (
                <span className='bg-accent text-muted-foreground absolute top-0 right-0 bottom-0 flex items-center rounded-r-md px-2 text-sm'>
                  {columnMeta.unit}
                </span>
              )}
            </div>
          );

        case 'range':
          return (
            <DataTableSliderFilter
              column={column}
              title={columnMeta.label ?? column.id}
            />
          );

        case 'date':
        case 'dateRange':
          return (
            <DataTableDateFilter
              column={column}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === 'dateRange'}
            />
          );

        case 'select':
        case 'multiSelect':
          return (
            <DataTableFacetedFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              multiple={columnMeta.variant === 'multiSelect'}
            />
          );

        default:
          return null;
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}