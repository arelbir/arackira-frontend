"use client";

import React, { useEffect } from "react";
import { useContracts } from "../hooks/useContracts";
import { useContractTable } from "../hooks/useContractTable";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Edit, Eye } from 'lucide-react';
import Link from 'next/link';

const ContractList: React.FC = () => {
  const { contracts, isLoading, isError, mutate } = useContracts();
  const { table } = useContractTable(contracts, mutate);
  const router = useRouter();

  useEffect(() => {
    const actionsColumn = table.getColumn('actions');
    if (actionsColumn) {
      actionsColumn.columnDef.cell = ({ row }) => {
        const contract = row.original;
        return (
          <div className="flex items-center gap-2 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/contracts/edit/${contract.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Düzenle</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/contracts/view/${contract.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Görüntüle</TooltipContent>
            </Tooltip>
          </div>
        );
      };
    }
  }, [table]);

  if (isError) return <div className="p-8 text-red-500">Hata: Veri alınamadı.</div>;

  return (
    <div className="flex h-full w-full flex-col p-8">
      <DataTableToolbar 
        table={table} 
        className="mb-3"
        onAction={() => mutate()}
        editBasePath="/dashboard/contracts"
      >
        <div className="flex flex-1 items-center space-x-2">
          <Button size="sm" onClick={() => router.push("/dashboard/contracts/new")}>
            Sözleşme Ekle
          </Button>
        </div>
      </DataTableToolbar>

      <div className="flex-1 min-h-0 flex flex-col overflow-auto mb-4">
        {isLoading ? (
          <DataTableSkeleton
            columnCount={table.getAllColumns().length}
            rowCount={10}
          />
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
};

export default ContractList;
