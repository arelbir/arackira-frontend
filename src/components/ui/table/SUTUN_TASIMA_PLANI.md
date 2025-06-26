# Tablo Sütunları Taşıma Özelliği Planlama Dokümanı

## Genel Bakış

Bu dokümanda TanStack Table (React Table v8) kullanarak tablolara sütunları sürükle-bırak ile taşıma/yeniden sıralama özelliğinin eklenmesi planlanmaktadır. Bu özellik, kullanıcıların tablo sütunlarını kişiselleştirmelerine olanak tanıyarak kullanıcı deneyimini geliştirecektir.

## Teknik Yaklaşım

TanStack Table, `columnOrder` state'i ve tablonun `onColumnOrderChange` event handler'ı aracılığıyla sütunların yeniden sıralanmasını destekler. Ek olarak, sürükle-bırak işlevselliği için `@dnd-kit` kütüphanesi kullanılacaktır.

## Gereken Bağımlılıklar

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Uygulama Adımları

### 1. Table Hook Güncelleme

`useTable` hook'unu sütunların sıralamasını yönetecek şekilde güncelleyin:

```typescript
// src/hooks/use-table.ts

import { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnOrderState
} from '@tanstack/react-table';

export function useTable<TData>({
  data,
  columns,
  // Diğer parametreler...
}) {
  // Sütunların varsayılan sıralamasını oluştur
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    () => columns.map(column => column.id)
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      // ... mevcut state
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    // ... diğer ayarlar
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return table;
}
```

### 2. Sürüklenebilir Sütun Başlığı Bileşeni

`data-table-draggable-header.tsx` adlı yeni bir bileşen oluşturun:

```typescript
// src/components/ui/table/data-table-draggable-header.tsx

import * as React from 'react';
import { flexRender, type Header } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableHead } from '@/components/ui/table';

interface DataTableDraggableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export function DataTableDraggableHeader<TData, TValue>({
  header,
}: DataTableDraggableHeaderProps<TData, TValue>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.id,
  });
  
  return (
    <TableHead 
      ref={setNodeRef} 
      style={{ 
        transform: CSS.Transform.toString(transform), 
        transition,
        position: 'relative',
        cursor: 'grab',
        ...getCommonPinningStyles({ column: header.column })
      }}
      className="select-none touch-none"
      {...attributes} 
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(
            header.column.columnDef.header,
            header.getContext()
          )}
      
      {/* İsteğe bağlı: sürükleme göstergesi */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="12" r="1"/>
          <circle cx="9" cy="5" r="1"/>
          <circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="12" r="1"/>
          <circle cx="15" cy="5" r="1"/>
          <circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
    </TableHead>
  );
}
```

### 3. data-table.tsx Bileşenini Güncelleme

Mevcut `data-table.tsx` bileşenini, `DndContext` ve `SortableContext` kullanarak güncelleyin:

```typescript
// src/components/ui/table/data-table.tsx

import * as React from 'react';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { 
  DndContext, 
  useSensors, 
  useSensor, 
  PointerSensor,
  closestCenter,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  SortableContext, 
  horizontalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import { DataTableDraggableHeader } from './data-table-draggable-header';
// Diğer import'lar...

export function DataTable<TData>({
  table,
  actionBar,
  children
}: DataTableProps<TData>) {
  // Sürükle-bırak sensörleri tanımlama
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Yanlışlıkla sürüklemeyi önlemek için minimum mesafe
      },
    })
  );

  // Sürükleme bitişinde çağrılacak fonksiyon
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over && active.id !== over.id) {
      const oldIndex = table.getState().columnOrder.indexOf(active.id as string);
      const newIndex = table.getState().columnOrder.indexOf(over.id as string);
      
      // Sütun sırasını güncelleme
      table.setColumnOrder(arrayMove(
        table.getState().columnOrder,
        oldIndex,
        newIndex
      ));
    }
  };

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      {children}
      <div className='relative flex flex-1'>
        <div className='absolute inset-0 flex overflow-hidden rounded-lg border'>
          <ScrollArea className='h-full w-full'>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                <DndContext 
                  sensors={sensors} 
                  onDragEnd={handleDragEnd}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToHorizontalAxis]}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <SortableContext 
                      key={headerGroup.id}
                      items={headerGroup.headers.map(h => h.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <TableRow>
                        {headerGroup.headers.map((header) => (
                          <DataTableDraggableHeader 
                            key={header.id} 
                            header={header}
                          />
                        ))}
                      </TableRow>
                    </SortableContext>
                  ))}
                </DndContext>
              </TableHeader>
              
              {/* Tablo gövdesi (değişiklik yok) */}
              <TableBody>
                {/* ... */}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
      
      {/* Sayfalama (değişiklik yok) */}
      <DataTablePagination table={table} />
    </div>
  );
}
```

### 4. Kullanıcı Tercihlerini Saklama (İsteğe Bağlı)

Kullanıcıların sütun sıralama tercihlerini saklamak için LocalStorage ve React Context kullanabilirsiniz:

```typescript
// src/context/table-preferences-context.tsx

import * as React from 'react';

interface TablePreferences {
  [tableId: string]: {
    columnOrder: string[];
    // Diğer tercihler...
  };
}

interface TablePreferencesContextValue {
  preferences: TablePreferences;
  updateColumnOrder: (tableId: string, columnOrder: string[]) => void;
}

const TablePreferencesContext = React.createContext<TablePreferencesContextValue>({
  preferences: {},
  updateColumnOrder: () => {},
});

export function TablePreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = React.useState<TablePreferences>(() => {
    // LocalStorage'dan tercihleri yükleme
    const saved = localStorage.getItem('tablePreferences');
    return saved ? JSON.parse(saved) : {};
  });

  // Tercihleri güncelleme ve kaydetme
  const updateColumnOrder = React.useCallback((tableId: string, columnOrder: string[]) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        [tableId]: {
          ...prev[tableId],
          columnOrder,
        },
      };
      
      // LocalStorage'a kaydetme
      localStorage.setItem('tablePreferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = React.useMemo(() => ({
    preferences,
    updateColumnOrder,
  }), [preferences, updateColumnOrder]);

  return (
    <TablePreferencesContext.Provider value={value}>
      {children}
    </TablePreferencesContext.Provider>
  );
}

export const useTablePreferences = () => React.useContext(TablePreferencesContext);
```

### 5. Sıfırlama ve Özelleştirme Seçenekleri

DataTableViewOptions bileşenine sütun sıralamasını sıfırlamak için bir buton ekleyin:

```typescript
// src/components/ui/table/data-table-view-options.tsx

import { Button } from '@/components/ui/button';
import { ArrowsClockwise } from '@phosphor-icons/react';

// ...mevcut kod...

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const resetColumnOrder = () => {
    // Sütunları orijinal sırasına döndür
    const defaultOrder = table.getAllColumns().map(column => column.id);
    table.setColumnOrder(defaultOrder);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* ... mevcut kod ... */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Görünüm Seçenekleri</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          {/* ... mevcut kod ... */}
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={resetColumnOrder}>
          <ArrowsClockwise className="mr-2 h-4 w-4" />
          <span>Sütun Sırasını Sıfırla</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Kullanım Örneği

Bir bileşende kullanımı:

```tsx
import { DataTable } from '@/components/ui/table/data-table';
import { useTable } from '@/hooks/use-table';
import { columns } from './columns';

export function UsersTable() {
  const { data } = useQuery({ ... }); // Veri kaynağından verileri alma
  
  const table = useTable({
    data,
    columns,
    // ... diğer seçenekler
  });

  return (
    <DataTable 
      table={table} 
      // ... diğer props
    />
  );
}
```

## Ek Geliştirme Fikirleri

1. **Sütun genişliklerini ayarlama**: TanStack Table'ın `columnSizing` özelliği ile sütun genişliklerini de ayarlanabilir hale getirebilirsiniz.

2. **Sütun gruplandırma**: Sütunları gruplandırma özelliği ekleyerek kullanıcıların ilgili sütunları bir araya getirmesini sağlayabilirsiniz.

3. **Sütun kilitleme**: Belirli sütunları sabitleyerek tablo yatay kaydırıldığında bile görünür kalmasını sağlayabilirsiniz.

4. **Temalandırma**: Sürükle-bırak esnasında ve hover durumunda görsel geri bildirim sağlayarak kullanıcı deneyimini geliştirebilirsiniz.

5. **API Entegrasyonu**: Kullanıcı tercihlerini sunucuda saklamak için API entegrasyonu ekleyebilirsiniz.

## Zaman Çizelgesi

- **Gün 1**: Proje bağımlılıklarını ekleyip, tasarım dokümanını gözden geçirme
- **Gün 2**: `useTable` hook'unu ve `DataTableDraggableHeader` bileşenini oluşturma
- **Gün 3**: `data-table.tsx` ve `data-table-view-options.tsx` bileşenlerini güncelleme
- **Gün 4**: Kullanıcı tercihleri saklama sistemini ekleme
- **Gün 5**: Test etme, hata ayıklama ve dokümantasyonu tamamlama

## Sonuç

Bu planlama belgesi, TanStack Table kullanarak tablo sütunlarını sürükle-bırak yöntemi ile taşıma özelliğinin nasıl uygulanacağını detaylı bir şekilde açıklamaktadır. Bu özellik, kullanıcıların tablo görünümlerini kişiselleştirmelerini sağlayarak kullanıcı deneyimini iyileştirecek ve uygulama kullanışlılığını artıracaktır.
