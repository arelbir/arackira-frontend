'use client';

import type { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { CheckIcon, CaretSortIcon } from '@radix-ui/react-icons';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  storageKey?: string; // Saklama anahtarı eklendi
}

export function DataTableViewOptions<TData>({
  table,
  storageKey = 'data-table-view' // Varsayılan anahtar
}: DataTableViewOptionsProps<TData>) {
  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== 'undefined' && column.getCanHide()
        ),
    [table]
  );

  // Sayfa yüklendiğinde localStorage'dan sütun görünürlük ayarlarını yükle
  React.useEffect(() => {
    const savedColumnVisibility = typeof window !== 'undefined' ? localStorage.getItem(`${storageKey}-visibility`) : null;
    
    if (savedColumnVisibility) {
      try {
        const parsedVisibility = JSON.parse(savedColumnVisibility);
        table.setColumnVisibility(parsedVisibility);
      } catch (error) {
        console.error('Sütun görünürlük ayarları yüklenemedi:', error);
      }
    }
  }, [table, storageKey]);

  // Sütun görünürlüğü değiştiğinde localStorage'a kaydet
  const toggleColumnVisibility = React.useCallback(
    (columnId: string, visible: boolean) => {
      // Önce sütun görünürlüğünü değiştir
      const column = table.getColumn(columnId);
      if (column) {
        column.toggleVisibility(visible);
        
        // Sonra yeni durumu localStorage'a kaydet
        const currentVisibility = table.getState().columnVisibility;
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${storageKey}-visibility`, JSON.stringify(currentVisibility));
        }
      }
    },
    [table, storageKey]
  );
  
  // Sütun sıralamasını sıfırlama fonksiyonu
  const resetColumnOrder = React.useCallback(() => {
    // Sütunları orijinal sırasına döndür
    const defaultOrder = table.getAllColumns().map(column => column.id);
    table.setColumnOrder(defaultOrder);
    
    // Yeni sıralamayı localStorage'a kaydet
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${storageKey}-order`, JSON.stringify(defaultOrder));
    }
  }, [table, storageKey]);
  
  // Sayfa yüklendiğinde localStorage'dan sütun sıralama ayarlarını yükle
  React.useEffect(() => {
    const savedColumnOrder = typeof window !== 'undefined' ? localStorage.getItem(`${storageKey}-order`) : null;
    
    if (savedColumnOrder) {
      try {
        const parsedOrder = JSON.parse(savedColumnOrder);
        table.setColumnOrder(parsedOrder);
      } catch (error) {
        console.error('Sütun sıralama ayarları yüklenemedi:', error);
      }
    }
  }, [table, storageKey]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label='Toggle columns'
          role='combobox'
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'
        >
          <Settings2 />
          Görünüm
          <CaretSortIcon className='ml-auto opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-44 p-0'>
        <Command>
          <CommandInput placeholder='Sütun ara...' />
          <CommandList>
            <CommandEmpty>Hiç sütun bulunamadı.</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  key={column.id}
                  onSelect={() => 
                    toggleColumnVisibility(column.id, !column.getIsVisible())
                  }
                >
                  <span className='truncate'>
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4 shrink-0',
                      column.getIsVisible() ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <CommandItem 
                onSelect={resetColumnOrder}
                className="border-t pt-1"
              >
                <ReloadIcon className="mr-2 h-4 w-4" />
                <span>Sütun Sırasını Sıfırla</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}