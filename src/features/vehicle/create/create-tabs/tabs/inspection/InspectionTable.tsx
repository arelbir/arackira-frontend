"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { createActionsColumn } from "@/components/ui/table/table-helpers";
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
      accessorKey: "result",
      header: "Sonuç",
      cell: ({ row }) => <span>{row.original.result || "–"}</span>,
    },
    createActionsColumn<EnrichedInspection>({ onEdit, onDelete }),
  ];

  const table = useReactTable({
    data: inspections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <DataTable table={table} className="w-full" />;
}
