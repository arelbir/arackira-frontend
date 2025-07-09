import { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnOrderState,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ColumnDef,
  Row
} from '@tanstack/react-table';

interface UseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialState?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
  };
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  manualPagination?: boolean;
  getRowId?: (row: TData) => string;
  onRowSelectionChange?: (rows: Row<TData>[]) => void;
}

export function useTable<TData>({
  data,
  columns,
  initialState,
  enableRowSelection = true,
  enableMultiRowSelection = true,
  manualPagination = false,
  getRowId,
  onRowSelectionChange
}: UseTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sütunların varsayılan sıralamasını oluştur
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    () => columns.map(column => column.id || '')
  );
  
  // Boş ID'leri filtrele
  const validColumnOrder = columnOrder.filter(id => id);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      columnOrder: validColumnOrder,
    },
    enableRowSelection,
    enableMultiRowSelection,
    manualPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId,
  });

  // Seçili satırları takip et ve callback'e aktar
  useState(() => {
    if (onRowSelectionChange && Object.keys(rowSelection).length) {
      const selectedRows = table
        .getRowModel()
        .rows.filter((row) => rowSelection[row.id]);
      onRowSelectionChange(selectedRows);
    }
  });

  return table;
}
