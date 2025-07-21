"use client";

import { Row } from "@tanstack/react-table";
import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, RefreshCwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTR } from "@/lib/utils";

interface InsuranceTableProps {
  insurances: any[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onRenew: (index: number) => void;
  insuranceTypes: any[];
}

export function InsuranceTable({
  insurances,
  onEdit,
  onDelete,
  onRenew,
  insuranceTypes,
}: InsuranceTableProps) {
  // Sigorta bitiş tarihine göre durumu hesapla
  const getInsuranceStatus = (endDate: string) => {
    if (!endDate) return { status: "inactive", label: "Belirsiz" };
    
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: "expired", label: "Süresi Doldu" };
    } else if (diffDays <= 30) {
      return { status: "warning", label: `${diffDays} gün kaldı` };
    } else {
      return { status: "active", label: "Aktif" };
    }
  };
  
  // Tablo sütunlarını tanımla
  const columns = [
    {
      accessorKey: "insurance_type_id",
      header: "Sigorta Türü",
      cell: ({ row }: { row: Row<any> }) => {
        const typeId = row.original.insurance_type_id;
        const typeLabel = insuranceTypes.find((x: any) => String(x.value) === String(typeId))?.label || `#${row.index + 1}`;
        return <span className="font-medium">{typeLabel}</span>;
      }
    },
    {
      accessorKey: "period",
      header: "Poliçe Süresi",
      cell: ({ row }: { row: Row<any> }) => {
        const { start_date, end_date } = row.original;
        const status = getInsuranceStatus(end_date);
        return (
          <div className="flex flex-col">
            <div className="text-sm">
              {formatDateTR(start_date) || "–"} → {formatDateTR(end_date) || "–"}
            </div>
            <Badge 
              variant={
                status.status === "expired" ? "destructive" : 
                status.status === "warning" ? "warning" :
                status.status === "active" ? "success" : "outline"
              }
              className="mt-1 w-fit text-xs"
            >
              {status.label}
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: "insurance_company_id",
      header: "Şirket",
      cell: ({ row }: { row: Row<any> }) => {
        return <span>{row.original.insurance_company_id ? "Şirket Adı" : "-"}</span>
      }
    },
    {
      accessorKey: "policy_number",
      header: "Poliçe No",
      cell: ({ row }: { row: Row<any> }) => {
        return <span>{row.original.policy_number || "-"}</span>
      }
    },
    {
      accessorKey: "total_amount",
      header: "Tutar",
      cell: ({ row }: { row: Row<any> }) => {
        const amount = row.original.total_amount || row.original.amount;
        if (!amount) return <span>-</span>;
        const currency = row.original.currency || "TL";
        return <span className="font-medium">{amount.toLocaleString('tr-TR')} {currency}</span>;
      }
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }: { row: Row<any> }) => {
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
      }
    }
  ];
  
  // TanStack table objesi oluştur
  const table = useReactTable({
    data: insurances,
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
