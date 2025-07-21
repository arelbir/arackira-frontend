"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTR } from "@/lib/utils";

import { EnrichedInspection } from "./InspectionTab";

interface InspectionTableProps {
  inspections: EnrichedInspection[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const safeFormatDate = (dateValue: unknown) => {
  if (!dateValue || typeof dateValue === 'boolean') {
    return "–";
  }
  try {
    const date = new Date(dateValue as string | number | Date);
    if (isNaN(date.getTime())) {
      return "–";
    }
    return formatDateTR(date);
  } catch (error) {
    return "–";
  }
};

const getInspectionStatus = (expiryDate?: Date) => {
  if (!expiryDate) {
    return { status: "inactive", label: "Tarih Yok" };
  }
  const today = new Date();
  const warningDate = new Date(expiryDate);
  warningDate.setMonth(warningDate.getMonth() - 1);

  if (expiryDate < today) {
    return { status: "expired", label: "Süresi Dolmuş" };
  }
  if (expiryDate < warningDate) {
    return { status: "warning", label: "Süresi Dolmak Üzere" };
  }
  return { status: "active", label: "Geçerli" };
};

export function InspectionTable({ inspections, onEdit, onDelete }: InspectionTableProps) {
  const columns: ColumnDef<EnrichedInspection>[] = [
    {
      id: "period",
      header: "Muayene Geçerlilik Süresi",
      cell: ({ row }) => {
        const inspectionDate = row.original.inspection_date;
        const expiryDate = row.original.expiry_date;
        const status = getInspectionStatus(expiryDate && typeof expiryDate !== 'boolean' ? new Date(expiryDate) : undefined);

        return (
          <div className="flex flex-col">
            <div className="text-sm">
              {safeFormatDate(inspectionDate)} → {safeFormatDate(expiryDate)}
            </div>
            <Badge
              variant={
                status.status === "expired"
                  ? "destructive"
                  : status.status === "warning"
                  ? "warning"
                  : "success"
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
      cell: ({ row }) => <span>{row.original.inspection_company_name || "–"}</span>,
    },
    {
      accessorKey: "cost",
      header: "Maliyet",
      cell: ({ row }) => {
        const cost = row.original.cost;
        return typeof cost === 'number'
          ? cost.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })
          : "–";
      },
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
    data: inspections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <DataTable table={table} className="w-full" />;
}
