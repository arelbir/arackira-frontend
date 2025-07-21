"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Hgs } from "./hgs-constants";

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
      accessorKey: "hgs_place",
      header: "Alındığı Yer",
    },
    {
      accessorKey: "hgs_vehicle_class",
      header: "Araç Sınıfı",
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
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.index)} title="Düzenle">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.index)}
            title="Sil"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: hgsRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <DataTable table={table} className="w-full" />;
}
