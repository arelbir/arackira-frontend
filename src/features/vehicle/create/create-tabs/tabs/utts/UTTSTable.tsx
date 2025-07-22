"use client";

"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { formatDate } from "@/lib/format";
import { Utts } from "./utts-constants";
import { createActionsColumn } from "@/components/ui/table/table-helpers";

interface UTTSTableProps {
  uttsRecords: Utts[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function UTTSTable({ uttsRecords, onEdit, onDelete }: UTTSTableProps) {
  const columns: ColumnDef<Utts>[] = [
    {
      accessorKey: "utts_code",
      header: "UTTS Kodu",
    },
    {
      accessorKey: "purchase_date",
      header: "Satın Alma Tarihi",
      cell: ({ row }) => formatDate(row.getValue("purchase_date")),
    },
    {
      accessorKey: "installation_date",
      header: "Montaj Tarihi",
      cell: ({ row }) => formatDate(row.getValue("installation_date")),
    },
    createActionsColumn<Utts>({ onEdit, onDelete }),
  ];

  const table = useReactTable({
    data: uttsRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <DataTable table={table} className="w-full" />;
}
