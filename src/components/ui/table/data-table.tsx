import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';
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

import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DataTableDraggableHeader } from './data-table-draggable-header';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  getRowProps?: (row: any) => React.HTMLAttributes<HTMLTableRowElement>;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  getRowProps
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
      // Sütun sırasını güncelleme
      const oldIndex = table.getState().columnOrder.indexOf(active.id as string);
      const newIndex = table.getState().columnOrder.indexOf(over.id as string);
      
      table.setColumnOrder(arrayMove(
        table.getState().columnOrder,
        oldIndex,
        newIndex
      ));
    }
  };
  


  return (
    <div className='flex flex-col space-y-4'>
      {children}
      <ScrollArea className='rounded-lg border'>
        <DndContext 
          sensors={sensors} 
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
        >
          <Table className="min-w-full table-auto">
            <TableHeader className='bg-muted sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <SortableContext 
                  key={headerGroup.id}
                  items={headerGroup.headers.map(h => h.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <DataTableDraggableHeader 
                        key={header.id} 
                        header={header}
                      />
                    ))}
                  </TableRow>
                </SortableContext>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    {...(getRowProps ? getRowProps(row) : {})}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4"
                        style={{
                          width: cell.column.getSize(),
                          ...getCommonPinningStyles({ column: cell.column })
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}