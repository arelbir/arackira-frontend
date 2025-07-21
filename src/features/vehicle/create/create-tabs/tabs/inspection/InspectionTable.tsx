"use client";

import { Row } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTR } from "@/lib/utils";
import { Inspection, getInspectionStatus, INSPECTION_FIELDS } from "./inspection-constants";

interface InspectionTableProps {
  inspections: Inspection[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function InspectionTable({ inspections, onEdit, onDelete }: InspectionTableProps) {
  const columns: ColumnDef<Inspection>[] = [
    {
      id: "period",
      header: "Muayene Geçerlilik Süresi",
      cell: ({ row }: { row: Row<Inspection> }) => {
        const inspectionDate = row.original[INSPECTION_FIELDS.INSPECTION_DATE];
        const expiryDate = row.original[INSPECTION_FIELDS.EXPIRY_DATE];
        const status = getInspectionStatus(String(expiryDate!));

        return (
          <div className="flex flex-col">
            <div className="text-sm">
              {formatDateTR(String(inspectionDate)) || "–"} → {formatDateTR(String(expiryDate)) || "–"}
            </div>
            <Badge
              variant={
                status.status === "expired"
                  ? "destructive"
                  : status.status === "warning"
                  ? "warning"
                  : status.status === "active"
                  ? "success"
                  : "outline"
              }
              className="mt-1 w-fit text-xs"
            >
              {status.label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "inspection_company_name",
      header: "İstasyon",
      cell: ({ row }: { row: Row<Inspection> }) => (
        <span>{row.original.inspection_company_name || "-"}</span>
      ),
    },
    {
      accessorKey: INSPECTION_FIELDS.COST,
      header: "Maliyet",
      cell: ({ row }: { row: Row<Inspection> }) => {
        const cost = row.original[INSPECTION_FIELDS.COST];
        if (cost === null || cost === undefined) return <span>-</span>;
        return (
          <span className="font-medium">
            {cost.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }: { row: Row<Inspection> }) => {
        return (
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
        );
      },
    },
  ];

  const table = useReactTable({
    data: inspections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <DataTable table={table} className="w-full" />;
}
