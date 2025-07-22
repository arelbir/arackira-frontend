"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { Gps } from "./gps-constants";
import { createActionsColumn } from "@/components/ui/table/table-helpers";

interface GPSTableProps {
  gpsRecords: Gps[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  highlightedIndex?: number | null;
}

export function GPSTable({ gpsRecords, onEdit, onDelete, highlightedIndex }: GPSTableProps) {
  const columns: ColumnDef<Gps>[] = [
    {
      accessorKey: "device_serial_number",
      header: "Seri Numarası",
    },
    {
      accessorKey: "installation_date",
      header: "Montaj Tarihi",
                  cell: ({ row }) => formatDate(row.getValue("installation_date")),
    },
    {
      accessorKey: "description",
      header: "Açıklama",
    },
    {
      accessorKey: "is_active",
      header: "Durum",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "success" : "destructive"}>
          {row.original.is_active ? "Aktif" : "Pasif"}
        </Badge>
      ),
    },
    createActionsColumn<Gps>({ onEdit, onDelete }),
  ];

  const table = useReactTable({
    data: gpsRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

      const getRowProps = (row: any) => {
    if (row.index === highlightedIndex) {
      return { className: 'bg-blue-50' };
    }
    return {};
  };

  return <DataTable table={table} getRowProps={getRowProps} className="w-full" />;
}
