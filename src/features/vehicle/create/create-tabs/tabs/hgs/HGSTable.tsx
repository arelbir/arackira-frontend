"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Hgs } from "./hgs-constants";
import { createActionsColumn } from "@/components/ui/table/table-helpers";

interface HGSTableProps {
  hgsRecords: Hgs[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function HGSTable({ hgsRecords, onEdit, onDelete }: HGSTableProps) {
  const columns: ColumnDef<Hgs>[] = [
    {
      accessorKey: "hgs_tag_no",
      header: "HGS Etiket No",
    },
    {
      accessorKey: "hgs_vehicle_class",
      header: "Araç Sınıfı",
    },
    {
      accessorKey: "hgs_place",
      header: "Alındığı Yer",
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
    createActionsColumn<Hgs>({ onEdit, onDelete }),
  ];

  const table = useReactTable({
    data: hgsRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <DataTable table={table} className="w-full" />;
}
