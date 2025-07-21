"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GPS_FIELDS } from "./gps-constants";

interface GPSData {
  [GPS_FIELDS.BRAND]?: string;
  [GPS_FIELDS.DEVICE_MODEL]?: string;
  [GPS_FIELDS.SIM_NUMBER]?: string;
  [GPS_FIELDS.GPS_TRACKING_STATUS]?: string;
}

interface GPSTableProps {
  fields: GPSData[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function GPSTable({ fields, onEdit, onRemove }: GPSTableProps) {
  const columns: ColumnDef<GPSData>[] = [
    {
      accessorKey: GPS_FIELDS.BRAND,
      header: "Marka",
      cell: ({ row }: { row: Row<GPSData> }) => <span>{row.original[GPS_FIELDS.BRAND] || "-"}</span>,
    },
    {
      accessorKey: GPS_FIELDS.DEVICE_MODEL,
      header: "Model",
      cell: ({ row }: { row: Row<GPSData> }) => <span>{row.original[GPS_FIELDS.DEVICE_MODEL] || "-"}</span>,
    },
    {
      accessorKey: GPS_FIELDS.SIM_NUMBER,
      header: "SIM No",
      cell: ({ row }: { row: Row<GPSData> }) => <span>{row.original[GPS_FIELDS.SIM_NUMBER] || "-"}</span>,
    },
    {
      accessorKey: GPS_FIELDS.GPS_TRACKING_STATUS,
      header: "Durum",
      cell: ({ row }: { row: Row<GPSData> }) => {
        const isActive = row.original[GPS_FIELDS.GPS_TRACKING_STATUS] === 'true';
        return <Badge variant={isActive ? "success" : "destructive"}>{isActive ? "Aktif" : "Pasif"}</Badge>;
      },
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }: { row: Row<GPSData> }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.index)} title="Düzenle">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(row.index)}
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
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <DataTable table={table} className="w-full" />;
}
