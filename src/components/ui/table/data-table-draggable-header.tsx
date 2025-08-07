import * as React from 'react';
import { flexRender, type Header } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableHead } from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';

interface DataTableDraggableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export function DataTableDraggableHeader<TData, TValue>({
  header,
}: DataTableDraggableHeaderProps<TData, TValue>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.id,
  });
  
  return (
    <TableHead 
      ref={setNodeRef} 
      style={{ 
        width: header.column.getSize(),
        transform: CSS.Transform.toString(transform), 
        transition,
        position: 'relative',
        cursor: 'grab',
        opacity: isDragging ? 0.8 : 1,
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
      
      {/* Sürükleme göstergesi */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100">
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