"use client";

import { 
  ColumnDef, 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel 
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { formatDate, formatCurrency } from "@/lib/format";
import { createActionsColumn } from "@/components/ui/table/table-helpers";
import { VehicleFormValues } from "@/features/vehicle/schemas";

// Enriched type for the table, including company and type names.
export type EnrichedInsurance = NonNullable<VehicleFormValues['insurances']>[number] & {
  id: string; // from useFieldArray
  insurance_company_name?: string;
  insurance_type_name?: string;
};

interface InsuranceTableProps {
  insurances: EnrichedInsurance[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function InsuranceTable({ insurances, onEdit, onDelete }: InsuranceTableProps) {
  const columns: ColumnDef<EnrichedInsurance>[] = [
    {
      accessorKey: "insurance_type_name",
      header: "Sigorta Türü",
      cell: ({ row }) => <span className="font-medium">{row.original.insurance_type_name || "—"}</span>,
    },
    {
      accessorKey: "policy_number",
      header: "Poliçe No",
      cell: ({ row }) => <span>{row.original.policy_number || "—"}</span>,
    },
    {
      accessorKey: "insurance_company_name",
      header: "Sigorta Şirketi",
      cell: ({ row }) => <span>{row.original.insurance_company_name || "—"}</span>,
    },
    {
      accessorKey: "start_date",
      header: "Başlangıç Tarihi",
      cell: ({ row }) => formatDate(row.original.start_date),
    },
    {
      accessorKey: "end_date",
      header: "Bitiş Tarihi",
      cell: ({ row }) => formatDate(row.original.end_date),
    },
    {
      accessorKey: "total_amount",
      header: "Tutar",
      cell: ({ row }) => formatCurrency(row.original.total_amount, row.original.currency),
    },
    createActionsColumn<EnrichedInsurance>({ onEdit, onDelete }),
  ];
  const table = useReactTable({
    data: insurances,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { 
      sorting: [{ id: 'start_date', desc: true }],
      columnVisibility: {
        // Add columns to hide by default here
      }
    },
    meta: { onEdit, onDelete },
  });

  return <DataTable table={table} />;
}
