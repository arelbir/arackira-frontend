"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, RefreshCwIcon } from "lucide-react";

import { formatDateTR } from "@/lib/utils";

import { VehicleFormValues } from "@/features/vehicle/schemas";

// Zenginleştirilmiş sigorta tipi, tabloya şirket ve tür adını da içerir.
export type EnrichedInsurance = NonNullable<VehicleFormValues['insurances']>[number] & {
  id: string; // from useFieldArray
  insurance_company_name?: string;
  insurance_type_name?: string;
};

interface InsuranceTableProps {
  insurances: EnrichedInsurance[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onRenew: (index: number) => void;
}

const safeFormatDate = (dateValue: unknown) => {
  if (!dateValue || typeof dateValue === 'boolean') {
    return "—";
  }
  try {
    const date = new Date(dateValue as string | number | Date);
    if (isNaN(date.getTime())) {
      return "—";
    }
    return formatDateTR(date);
  } catch (error) {
    return "—";
  }
};

export function InsuranceTable({
  insurances,
  onEdit,
  onDelete,
  onRenew,
}: InsuranceTableProps) {
  const columns: ColumnDef<EnrichedInsurance>[] = [
    {
      accessorKey: "insurance_type_name",
      header: "Sigorta Türü",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.insurance_type_name || "-"}</span>
      ),
    },
    {
      id: "period",
      header: "Poliçe Süresi",
      cell: ({ row }) => {
        const startDate = row.original.start_date;
        const endDate = row.original.end_date;

        return (
          <div className="text-sm">
            {safeFormatDate(startDate)} → {safeFormatDate(endDate)}
          </div>
        );
      },
    },
    {
      accessorKey: "insurance_company_name",
      header: "Şirket",
      cell: ({ row }) => <span>{row.original.insurance_company_name || "-"}</span>,
    },
    {
      accessorKey: "policy_number",
      header: "Poliçe No",
      cell: ({ row }) => <span>{row.original.policy_number ? String(row.original.policy_number) : "-"}</span>
    },
    {
      accessorKey: "total_amount",
      header: "Tutar",
      cell: ({ row }) => {
        const amount = row.original.total_amount;
        const currency = "TRY"; // Bu dinamik hale getirilebilir
        return <span>{typeof amount === 'number' ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount) : "-"}</span>;
      }
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.index)}
              title="Düzenle"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRenew(row.index)}
              title="Yenile"
            >
              <RefreshCwIcon className="h-4 w-4" />
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
    }
  ];
  
  // TanStack table objesi oluştur
  const table = useReactTable({
    data: insurances || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  
  return (
    <DataTable
      table={table}
      className="w-full"
    />
  );
}
